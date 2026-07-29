// This file runs on the SERVER (Vercel), never in the user's browser.
// This is where your secret Groq API key lives, safely hidden from visitors.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, desc, price, category } = req.body || {};

  if (!name || !desc) {
    return res.status(400).json({ error: 'Please provide a product name and description.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing GROQ_API_KEY. Add it in Vercel → Project → Settings → Environment Variables.'
    });
  }

  const priceLabelMap = {
    'under-30': 'Under $30',
    '30-80': '$30 - $80',
    '80-200': '$80 - $200',
    '200-plus': '$200+'
  };
  const priceLabel = priceLabelMap[price] || price || 'Not specified';

  const prompt = `
You are a sharp, practical direct-response marketing strategist. A small business owner is describing their product. 
Analyze it and return a customer-acquisition plan.

PRODUCT NAME: ${name}
DESCRIPTION: ${desc}
PRICE RANGE: ${priceLabel}
CATEGORY: ${category || 'Not specified'}

Return ONLY a single valid JSON object with this EXACT shape (no markdown fences, no commentary, no extra keys):

{
  "personas": [
    {
      "name": "short persona name",
      "age": "age range like 25-40",
      "traits": ["trait 1", "trait 2", "trait 3"],
      "pain": "one sentence about their core pain point relevant to this product",
      "trigger": "one sentence about what makes them buy right now",
      "tags": ["short tag 1", "short tag 2", "short tag 3"]
    }
  ],
  "channels": [
    {
      "name": "channel name e.g. TikTok Organic + Spark Ads",
      "cost": "rough cost level e.g. Very Low, Low-Medium, Medium, Medium-High",
      "why": "one to two sentence explanation specific to THIS product and price point",
      "badge": "short badge like 'Best start', 'High intent', 'Free leverage'",
      "badgeClass": "mid or empty string"
    }
  ],
  "messaging": [
    { "title": "short label for this message", "text": "the actual ad hook / copy, 1-3 sentences" }
  ],
  "testPlan": "an HTML string starting with an <h4>Budget: $X-$Y total</h4> heading, followed by an <ol> with 5-7 <li> steps for a realistic low-budget 7 day test plan appropriate to this exact product and price, and ending with a <p><strong>Success metric:</strong> ...</p> paragraph"
}

Rules:
- Exactly 3 personas.
- Exactly 5-6 channels, ordered from best/cheapest starting point to more expensive, each genuinely relevant to this specific product, price point and category (not generic filler).
- Exactly 4 messaging entries: at least one hook per top persona, one short ad primary text, and one social-proof style line.
- Keep all text concise and usable as-is by a small business owner.
- testPlan total budget should roughly match the product's price point (cheap products get cheaper test budgets).
- Return raw JSON only. Do not wrap it in markdown code fences.
`.trim();

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing strategist AI. You always respond with ONLY a single valid JSON object matching the schema the user gives you. Never include markdown formatting, code fences, or any text outside the JSON object.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ error: 'The AI provider returned an error. Please try again in a moment.' });
    }

    const data = await groqResponse.json();
    const raw = data?.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(502).json({ error: 'The AI did not return a usable response. Please try again.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse AI JSON:', raw);
      return res.status(502).json({ error: 'The AI response was not valid JSON. Please try again.' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong analyzing your product. Please try again.' });
  }
}
