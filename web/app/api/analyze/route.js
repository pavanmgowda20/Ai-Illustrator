import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, mode, count, userName } = await req.json();
    const characterName = userName ? userName.trim() : 'Xiaohei';
    
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
    const systemPrompt = `You are the "${characterName} Illustrations Strategy Planner", a professional visual designer that deconstructs articles and designs hand-drawn visual metaphors featuring the character "${characterName}".

Your goal is to parse the user's article text (or concept statement) and generate a planned list of illustration spots (shot list) to be created.

STYLE DNA:
- Background: Pure white (no texture, no gradient, no shadows).
- Outline style: Hand-drawn black line-art (thin, slightly wobbly pen lines, not vector or clip art).
- Spacing: High whitespace (subject takes 40%-60% of canvas, at least 35% empty space).
- Colors: Restricted. Black for outline/character; Orange for processes/flow arrows; Red for warnings/problems/critical alerts; Blue for supplemental notes or state indicators.
- NEVER write formal titles (like "Flowchart", "Workflow") in the top-left corner.
- NEVER output formal PPT infographics, commercial vector illustrations, cute children posters, or realistic UIs.
- NO CHINESE CHARACTERS: Absolutely NO Chinese text or Chinese characters. All titles, metaphors, actions, and annotation labels inside the illustration must be in English.

${characterName.toUpperCase()} IP CHARACTER DNA:
- Shape: Small solid-black creature with white dot eyes, thin legs/arms. Body can be oval, cylindrical, shadow-like, etc.
- Personality: Serious, deadpan, focused, silent operator. Performs slightly absurd but system-critical operations. NOT cute, NOT a sticker, NOT a mascot just standing in the corner.
- ${characterName} must participate in the core action of the illustration.

COMPOSITION & METAPHOR GENERATION:
1. Turn abstract concept into a PHYSICAL ACTION (e.g. sifting, clogging, weighing, linking, folding, stitching, breaking, leaking).
2. Represent the system structure with LOW-TECH OBJECTS (e.g. wobbly wooden pipes, cardboard box, pulleys, funnels, scales, drawers, ladders, clotheslines, stamp tools, retro switches).
3. Put ${characterName} in control of the action (e.g. stuck inside a pipe, pulling a lever, balancing a scale, sewing lines together, stamping labels, carrying a heavy box).
4. Choose ONE structure type for each shot: "Workflow", "System", "Contrast", "State", "Metaphor", "Layers", "Route", or "Comic".

Choose anchors intelligently based on cognitive transitions, warnings, inputs/outputs, or contrasts. Do not over-illustrate. For an article, generate up to ${count} shots. For a single concept, generate exactly 1 shot.

You MUST respond with a JSON object containing a "shots" array following this exact schema:
{
  "shots": [
    {
      "id": 1,
      "paragraphAfter": "English description of where this goes, e.g., 'After the paragraph introducing the Solopreneur model'",
      "theme": "English short title of the illustration theme (e.g., 'Information Overload')",
      "structureType": "Workflow / System / Contrast / State / Metaphor / Layers / Route / Comic",
      "metaphor": "English description of the visual metaphor (e.g., '${characterName} trying to force a thick information pipe into a tiny funnel, causing splashes')",
      "xiaoheiAction": "Detailed English composition prompt explaining ${characterName}'s position, what ${characterName} is holding/doing, the wobbly lines, and layout items",
      "labels": ["English label 1", "English label 2", "English label 3"]
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
