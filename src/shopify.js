// Shopify Storefront API — public (no token needed, store is public)
const SHOP_DOMAIN = 'sockriot.com';
const API_VERSION = '2026-01';
const ENDPOINT = `https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function storefrontQuery(query) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

const accents = ['#E8423F','#E87D3E','#9B59B6','#4BA364','#2F9CAD','#D64BA0','#D4A017'];
const bgs     = ['#FFF0EF','#FFF4EC','#F6F0FA','#EEFBF2','#EDF9FB','#FDF0F8','#FFFCEE'];

function getCat(title) {
  if (title.includes("Women\u2019s Crew") || title.includes("Women's Crew")) return "Women's Crew";
  if (title.includes("Men\u2019s Crew") || title.includes("Men's Crew")) return "Men's Crew";
  if (title.includes("Ankle")) return "Women's Ankle";
  if (title.includes("Sneaker")) return "Sneaker";
  if (title.includes("Hand Cream")) return "Hand Cream";
  if (title.includes("Oven Mitt")) return "Oven Mitt";
  if (title.includes("Apron")) return "Apron";
  if (title.includes("Dish Towel")) return "Dish Towel";
  return "Socks";
}

function cleanTitle(raw) {
  return raw
    .replace(/^Blue Q [^–]+ \u2013 /, '')
    .replace(/^Blue Q [^-]+ - /, '')
    .replace(/[\u201c\u201d"]/g, '')
    .replace(/ (Crew Socks|Ankle Socks|Sneaker Socks|Crew)$/, '')
    .trim();
}

export async function fetchProducts() {
  try {
    let all = [], cursor = null, hasNext = true;
    while (hasNext && all.length < 150) {
      const after = cursor ? `, after: "${cursor}"` : '';
      const data = await storefrontQuery(`{
        products(first: 50${after}) {
          pageInfo { hasNextPage endCursor }
          edges { node {
            id title tags
            priceRange { minVariantPrice { amount } }
            images(first: 1) { edges { node { url } } }
            variants(first: 1) { edges { node { id } } }
          }}
        }
      }`);
      if (data.errors) return null;
      const { edges, pageInfo } = data.data.products;
      all.push(...edges.map(e => e.node));
      hasNext = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    }

    return all
      .filter(p => !p.tags.includes('bundle') && !p.tags.includes('gift pack'))
      .map((p, i) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        const variantId = p.variants.edges[0]?.node.id;
        const name = cleanTitle(p.title);
        const cat = getCat(p.title);
        const accent = accents[i % accents.length];
        const bg = bgs[i % bgs.length];
        const lower = name.toLowerCase();
        const humor = (lower.includes('fuck') || lower.includes('shit') || lower.includes('ass') || lower.includes('bitch'))
          ? 'sweary'
          : (lower.includes('power') || lower.includes('strong') || lower.includes('boss') || lower.includes('superpower'))
          ? 'empowerment' : 'wholesome';
        const tags = p.tags || [];
        let tag = null;
        if (tags.includes('bestseller')) tag = 'BESTSELLER';
        else if (tags.includes('new')) tag = 'NEW';
        const imageUrl = p.images?.edges?.[0]?.node?.url || null;
        return { id: p.id, variantId, name, cat, price, tag, accent, bg, humor, desc: '', imageUrl };
      });
  } catch (e) {
    console.warn('Shopify fetch failed, using fallback:', e);
    return null;
  }
}

export async function createCheckout(cart) {
  try {
    const lineItems = cart
      .filter(i => i.variantId)
      .map(i => `{ variantId: "${i.variantId}", quantity: ${i.qty} }`)
      .join(', ');
    const data = await storefrontQuery(`
      mutation {
        checkoutCreate(input: { lineItems: [${lineItems}] }) {
          checkout { webUrl }
          userErrors { field message }
        }
      }
    `);
    return data.data?.checkoutCreate?.checkout?.webUrl;
  } catch (e) {
    console.warn('Checkout failed:', e);
    return null;
  }
}
