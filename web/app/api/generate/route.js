import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { shot } = await req.json();

    // API key resolution: check custom header first, then env variables
    const clientKey = req.headers.get('x-api-key');
    const provider = req.headers.get('x-provider') || 'openai';
    const customBaseUrl = req.headers.get('x-base-url') || '';
    const customImageModel = req.headers.get('x-image-model') || '';

    // Endpoint and Model determination (moved up to assist key resolution)
    let endpointUrl = 'https://api.openai.com/v1/images/generations';
    let modelName = customImageModel || 'dall-e-3';

    if (provider === 'grok') {
      endpointUrl = customBaseUrl || 'https://api.x.ai/v1/images/generations';
      if (!endpointUrl.endsWith('/images/generations')) {
        endpointUrl = endpointUrl.replace(/\/$/, '') + '/images/generations';
      }
      modelName = customImageModel || 'grok-2';
    } else if (provider === 'groq' || customImageModel === 'pollinations-flux') {
      endpointUrl = 'https://image.pollinations.ai/p/';
      modelName = 'pollinations-flux';
    } else if (provider === 'custom') {
      endpointUrl = customBaseUrl || 'https://api.openai.com/v1/images/generations';
      if (!endpointUrl.endsWith('/images/generations')) {
        endpointUrl = endpointUrl.replace(/\/$/, '') + '/images/generations';
      }
      modelName = customImageModel || 'dall-e-3';
    }

    // Choose key based on provider
    let apiKey = clientKey;
    if (!apiKey) {
      if (provider === 'openai') {
        apiKey = process.env.OPENAI_API_KEY;
      } else if (provider === 'grok') {
        apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
      } else if (provider === 'groq') {
        // Groq uses pollinations-flux silently, which is keyless
        apiKey = 'keyless';
      } else {
        apiKey = process.env.CUSTOM_API_KEY || process.env.OPENAI_API_KEY;
      }
    }

    if (modelName !== 'pollinations-flux' && !apiKey) {
      return NextResponse.json(
        { message: `API key is required for provider: ${provider}. Please configure it in Settings.` },
        { status: 401 }
      );
    }

    if (!shot) {
      return NextResponse.json({ message: 'Shot detail is required.' }, { status: 400 });
    }

    const { theme, metaphor, structureType, xiaoheiAction, labels } = shot;

    // Formatting English handwritten labels in prompt
    const formattedLabels = labels && labels.length > 0
      ? labels.map(l => `"${l}"`).join(', ')
      : '';

    const labelAnnotation = formattedLabels
      ? `Include sparse, clean, small handwritten English annotations in red, orange, or blue ink placed next to the relevant parts, strictly using these exact English texts: ${formattedLabels}. Do not write any Chinese characters. The handwriting is informal and sketch-like.`
      : '';

    // Constructing the visual prompt based on prompt-template.md
    const dallePrompt = `Generate a minimalist 16:9 landscape line art illustration.

Visual Style DNA:
A pure, flat solid white background. Extreme minimalism. Simple wobbly black ink pen lines. No paper texture, no shadows, no gradients, no borders. High whitespace layout (empty canvas surrounding a central concept that takes up 45% of the frame). Highly restrained color highlights: main sketch lines and characters are black; primary arrows, flows, or paths are thin orange pen lines; critical feedback, warnings, or problem objects are marked with red; secondary annotations or feedback states are blue. No formal chart titles or captions in the corners. Absolutely no Chinese characters, Chinese symbols, or Chinese text on the image. All written text must be strictly in English.

IP Character (Xiaohei):
A recurring tiny solid-black character named "Xiaohei" or "小黑". He has a wobbly solid-black body shape, two simple white dot eyes, thin stick-like legs, and a completely blank, serious, deadpan expression. Xiaohei must be actively participating in the core action, not just standing there.

Core Concept & Theme:
"${theme}" - expressing the idea: "${metaphor}".

Composition Layout:
A wobbly sketch showing ${xiaoheiAction}. The layout is simple, raw, and feels like a hand-drawn sketch on a whiteboard.

Labels:
${labelAnnotation}

Final Constraints:
Only output the sketch. Do not add frames, borders, realistic UI elements, digital gradients, or 3D renderings. All text must be in English. No Chinese characters. Make it look like an conceptual whiteboard sketch created by a product designer.`;

    // Call Pollinations API directly if selected (free & keyless)
    if (modelName === 'pollinations-flux') {
      const seed = Math.floor(Math.random() * 1000000);
      // Clean up newlines and double spaces to avoid HTTP 404/414 URL length issues
      const cleanedPrompt = dallePrompt.replace(/\s+/g, ' ').trim();
      // Use 1024x576 for native 16:9 landscape aspect ratio
      const imageUrl = `https://image.pollinations.ai/p/${encodeURIComponent(cleanedPrompt)}?width=1024&height=576&nologo=true&seed=${seed}&model=flux`;
      return NextResponse.json({ imageUrl });
    }

    // Call API via fetch
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        prompt: dallePrompt,
        n: 1,
        size: '1792x1024', // Standard landscape for 16:9
        quality: provider === 'openai' ? 'standard' : undefined,
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Upstream Image Gen API returned error (status ' + response.status + '):', errText);
      try {
        const err = JSON.parse(errText);
        return NextResponse.json(
          { message: err.error?.message || err.message || 'Image Generation API Error' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { message: `Image Gen API Error (Status ${response.status}): ${errText}` },
          { status: response.status }
        );
      }
    }

    const resData = await response.json();
    const imageUrl = resData.data[0].url;

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error.' }, { status: 500 });
  }
}
