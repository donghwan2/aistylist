interface Env {
  OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const { photo, height, weight } = await request.json() as {
      photo: string | null;
      height: string;
      weight: string;
    };

    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // OpenAI API 호출 (gpt-4o-mini 모델 사용 - 이미지와 텍스트 지원)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 전문 퍼스널 스타일리스트입니다. 사용자의 키, 몸무게, 그리고 사진(제공된 경우)을 바탕으로 체형에 어울리는 스타일 제안을 한국어로 작성하세요. 말투는 친절하고 전문적이어야 합니다.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `제 키는 ${height}cm이고, 몸무게는 ${weight}kg입니다. 제게 어울리는 스타일을 분석해 주세요.`,
              },
              ...(photo
                ? [
                    {
                      type: 'image_url',
                      image_url: { url: photo },
                    },
                  ]
                : []),
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json() as any;
    
    if (data.error) {
        throw new Error(data.error.message);
    }

    return new Response(JSON.stringify({ result: data.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
