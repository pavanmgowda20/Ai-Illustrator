import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, mode, count } = await req.json();
    
    // API key resolution: check custom header first, then env variables
    const clientKey = req.headers.get('x-api-key');
    const provider = req.headers.get('x-provider') || 'openai';
    const customBaseUrl = req.headers.get('x-base-url') || '';
    const customTextModel = req.headers.get('x-text-model') || '';

    // Choose key based on provider
    let apiKey = clientKey;
    if (!apiKey) {
      if (provider === 'openai') {
        apiKey = process.env.OPENAI_API_KEY;
      } else if (provider === 'grok') {
        apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
      } else if (provider === 'groq') {
        apiKey = process.env.GROQ_API_KEY;
      } else {
        apiKey = process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY;
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { message: `API key is required for provider: ${provider}. Please set it in Settings.` },
        { status: 401 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ message: 'Input text is required.' }, { status: 400 });
    }

    // Endpoint and Model determination
    let endpointUrl = 'https://api.openai.com/v1/chat/completions';
    let modelName = customTextModel || 'gpt-4o-mini';

    if (provider === 'grok') {
      endpointUrl = customBaseUrl || 'https://api.x.ai/v1/chat/completions';
      if (!endpointUrl.endsWith('/chat/completions')) {
        endpointUrl = endpointUrl.replace(/\/$/, '') + '/chat/completions';
      }
      modelName = customTextModel || 'grok-2';
    } else if (provider === 'groq') {
      endpointUrl = customBaseUrl || 'https://api.groq.com/openai/v1/chat/completions';
      if (!endpointUrl.endsWith('/chat/completions')) {
        endpointUrl = endpointUrl.replace(/\/$/, '') + '/chat/completions';
      }
      modelName = customTextModel || 'llama-3.3-70b-versatile';
    } else if (provider === 'custom') {
      endpointUrl = customBaseUrl || 'https://api.openai.com/v1/chat/completions';
      if (!endpointUrl.endsWith('/chat/completions')) {
        endpointUrl = endpointUrl.replace(/\/$/, '') + '/chat/completions';
      }
      modelName = customTextModel || 'gpt-4o-mini';
    }

    // Comprehensive Prompt incorporating SKILL.md and references
    const systemPrompt = `You are the "Ian Xiaohei Illustrations Strategy Planner", a professional visual designer that deconstructs Chinese articles and designs hand-drawn visual metaphors featuring the character "Xiaohei".

Your goal is to parse the user's article text (or concept statement) and generate a planned list of illustration spots (shot list) to be created.

STYLE DNA:
- Background: Pure white (no texture, no gradient, no shadows).
- Outline style: Hand-drawn black line-art (thin, slightly wobbly pen lines, not vector or clip art).
- Spacing: High whitespace (subject takes 40%-60% of canvas, at least 35% empty space).
- Colors: Restricted. Black for outline/character; Orange for processes/flow arrows; Red for warnings/problems/critical alerts; Blue for supplemental notes or state indicators.
- NEVER write formal titles (like "Flowchart", "Workflow") in the top-left corner.
- NEVER output formal PPT infographics, commercial vector illustrations, cute children posters, or realistic UIs.

XIAOHEI IP CHARACTER DNA:
- Shape: Small solid-black creature with white dot eyes, thin legs/arms. Body can be oval, cylindrical, shadow-like, etc.
- Personality: Serious, deadpan, focused, silent operator. Performs slightly absurd but system-critical operations. NOT cute, NOT a sticker, NOT a mascot just standing in the corner.
- Xiaohei must participate in the core action of the illustration.

COMPOSITION & METAPHOR GENERATION:
1. Turn abstract concept into a PHYSICAL ACTION (e.g. sifting, clogging, weighing, linking, folding, stitching, breaking, leaking).
2. Represent the system structure with LOW-TECH OBJECTS (e.g. wobbly wooden pipes, cardboard box, pulleys, funnels, scales, drawers, ladders, clotheslines, stamp tools, retro switches).
3. Put Xiaohei in control of the action (e.g. stuck inside a pipe, pulling a lever, balancing a scale, sewing lines together, stamping labels, carrying a heavy box).
4. Choose ONE structure type for each shot: "Workflow", "System", "Contrast", "State", "Metaphor", "Layers", "Route", or "Comic".

Choose anchors intelligently based on cognitive transitions, warnings, inputs/outputs, or contrasts. Do not over-illustrate. For an article, generate up to ${count} shots. For a single concept, generate exactly 1 shot.

You MUST respond with a JSON object containing a "shots" array following this exact schema:
{
  "shots": [
    {
      "id": 1,
      "paragraphAfter": "Description in Chinese of where this goes, e.g., '放在介绍一人公司的段落后面' (For single concept, use '观点配图')",
      "theme": "Chinese short title of the illustration theme (e.g., '多源信息过载')",
      "structureType": "Workflow / System / Contrast / State / Metaphor / Layers / Route / Comic",
      "metaphor": "Chinese description of the visual metaphor (e.g., '小黑试图将粗大的信息水管塞进小水漏里，导致水花四溅')",
      "xiaoheiAction": "Detailed English composition prompt explaining Xiaohei's position, what Xiaohei is holding/doing, the wobbly lines, and layout items",
      "labels": ["Chinese label 1", "Chinese label 2", "Chinese label 3"]
    }
  ]
}`;

    const userMessage = mode === 'concept'
      ? `Provide a visual metaphor for the following concept statement: "${text}"`
      : `Deconstruct the following article content and suggest a shot list of up to ${count} illustrations: \n\n${text}`;

    // Call API via fetch
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Upstream API returned error (status ' + response.status + '):', errText);
      try {
        const err = JSON.parse(errText);
        return NextResponse.json(
          { message: err.error?.message || err.message || 'API Error' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { message: `API Error (Status ${response.status}): ${errText}` },
          { status: response.status }
        );
      }
    }

    const resData = await response.json();
    const parsedContent = JSON.parse(resData.choices[0].message.content);

    return NextResponse.json(parsedContent);

  } catch (error) {
    console.error('Analyze API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error.' }, { status: 500 });
  }
}
