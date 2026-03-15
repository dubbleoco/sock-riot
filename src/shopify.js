// Shopify Storefront API client
const SHOP_DOMAIN = 'qwm0fd-fg.myshopify.com';
const STOREFRONT_TOKEN = 'YOUR_STOREFRONT_TOKEN_HERE'; // Replace after enabling in Shopify admin
const API_VERSION = '2026-01';
const ENDPOINT = `https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function storefrontQuery(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

export async function fetchProducts() {
  const data = await storefrontQuery(`
    {
      products(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            title
            tags
            variants(first: 1) {
              edges {
                node {
                  id
                  price { amount }
                }
              }
            }
            priceRange {
              minVariantPrice { amount }
            }
          }
        }
      }
    }
  `);

  if (data.errors) {
    console.warn('Shopify Storefront API error:', data.errors);
    return null; // Will fall back to hardcoded products
  }

  return data.data.products.edges.map((edge, i) => {
    const p = edge.node;
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    const variantId = p.variants.edges[0]?.node.id;
    const title = p.title.replace(/Blue Q [^–]+ – /, '').replace(/["""]/g, '').replace(/ (Crew Socks|Ankle Socks|Sneaker Socks)$/, '');
    const tags = p.tags || [];

    // Assign accent colors by index for variety
    const accents = ['#E8423F','#E87D3E','#9B59B6','#4BA364','#2F9CAD','#D64BA0','#D4A017'];
    const bgs = ['#FFF0EF','#FFF4EC','#F6F0FA','#EEFBF2','#EDF9FB','#FDF0F8','#FFFCEE'];
    const accent = accents[i % accents.length];
    const bg = bgs[i % bgs.length];

    // Determine tag
    let tag = null;
    if (tags.includes('bestseller') || tags.includes('best_seller')) tag = 'BESTSELLER';
    else if (tags.includes('new')) tag = 'NEW';
    else if (tags.includes('staff_pick')) tag = 'STAFF PICK';

    // Determine humor type
    const lower = title.toLowerCase();
    const humor = lower.includes('fuck') || lower.includes('shit') || lower.includes('ass') || lower.includes('bitch')
      ? 'sweary'
      : lower.includes('power') || lower.includes('strong') || lower.includes('boss')
      ? 'empowerment'
      : 'wholesome';

    return { id: p.id, variantId, name: title, cat: getCat(p.title), price, tag, accent, bg, humor, desc: '' };
  });
}

function getCat(title) {
  if (title.includes("Women's Crew")) return "Women's Crew";
  if (title.includes("Men's Crew")) return "Men's Crew";
  if (title.includes("Ankle")) return "Women's Ankle";
  if (title.includes("Sneaker")) return "Sneaker";
  if (title.includes("Hand Cream")) return "Hand Cream";
  if (title.includes("Oven Mitt")) return "Oven Mitt";
  return "Socks";
}

export async function createCheckout(items) {
  // items = [{ variantId, quantity }]
  const lineItems = items.map(i => `{ variantId: "${i.variantId}", quantity: ${i.qty} }`).join(', ');
  const data = await storefrontQuery(`
    mutation {
      checkoutCreate(input: {
        lineItems: [${lineItems}]
      }) {
        checkout { webUrl }
        userErrors { field message }
      }
    }
  `);
  return data.data?.checkoutCreate?.checkout?.webUrl;
}
