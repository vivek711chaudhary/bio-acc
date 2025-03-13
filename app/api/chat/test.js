import OpenAI from "openai";
const openai  = new OpenAI({apiKey: "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"});

const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: "What's in this image?" },
                {
                    type: "image_url",
                    image_url: {
                        url: "https://i.chzbgr.com/thumb800/37326085/h677B80A8/problems-programmers-mechanical-engineer-computer-science-math-science-math-memes-science-memes",
                    },
                },
            ],
        },
    ],
});

console.log(response.choices[0].message.content);

// https://i.chzbgr.com/thumb800/37326085/h677B80A8/problems-programmers-mechanical-engineer-computer-science-math-science-math-memes-science-memes

// const response = await openai.images.generate({
//     model: "dall-e-3",
//     prompt: "a white siamese cat",
//     n: 1,
//     size: "1024x1024",
//   });
  
//   console.log(response.data[0].url);