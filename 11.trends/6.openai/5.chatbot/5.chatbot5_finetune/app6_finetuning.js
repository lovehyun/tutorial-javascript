// https://platform.openai.com/docs/guides/fine-tuning/create-a-fine-tuned-model?lang=node.js
const { OpenAI } = require('openai');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// OpenAI 셋업
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Upload File to OpenAI
async function upload_finetuding_dataset() {
    await openai.files.create({
        file: fs.createReadStream("data/style-and-tone.jsonl"),
        purpose: "fine-tune"
    });
}

// 2. List Files
async function list_files() {
    const files = await openai.files.list();
    console.log(files);
}

// 3a. Start Fine-Tuning job
async function load_fine_tuned_model() {
    const fineTune = await openai.fineTunes
        .create({
            training_file: "file-BXFdjGR1bFNu6V2JR5GBB8jH",
            model: "gpt-3.5-turbo-1106",
        })
        .catch((err) => {
            if (err instanceof OpenAI.APIError) {
                console.error(err);
            } else {
                throw err;
            }
        });

        console.log(fineTune);
}

// 3b. Start Fine-Tuning job (with fetch)
async function load_fine_tuned_model2() {
    const requestData = {
        training_file: "file-dcDPIB2Am86u2EHlM3CLYgCU",
        model: "gpt-3.5-turbo-1106",
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    fetch("https://api.openai.com/v1/fine_tuning/jobs", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Response:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// 4. Control and check models
async function control_models() {
    // List 10 fine-tuning jobs
    // let page = await openai.fineTuning.jobs.list({ limit: 10 });
    // console.log(page);

    // Retrieve the state of a fine-tune
    let fineTune = await openai.fineTuning.jobs.retrieve('ftjob-eVQEGSZ3joUUhHCABmZL1Lry');
    console.log(fineTune);

    // Cancel a job
    // let status = await openai.fineTuning.jobs.cancel('ftjob-abc123');
    // console.log(status);

    // List up to 10 events from a fine-tuning job
    // let events = await openai.fineTuning.jobs.listEvents(fineTune.id, { limit: 10 });
    // console.log(events);

    // Delete a fine-tuned model (must be an owner of the org the model was created in)
    // let model = await openai.models.delete('ft:gpt-3.5-turbo:acemeco:suffix:abc123')
    // console.log(model);
}

// 5. Use Fine-tuned model
async function use_fine_tuned_model(message) {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant that speaks like Marv." },
            { role: "user", content: message},
        ],
        model: "ft:gpt-3.5-turbo-1106:personal::8S4LSBpS",
    });
    console.log(completion.choices);
}

// 6. Compare models
async function compare_models(message) {
    // Using the model without fine-tuning
    const standardModelCompletion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ],
        model: "gpt-3.5-turbo",  // Use the base GPT-3 model without fine-tuning
    });

    // Using the fine-tuned model
    const fineTunedCompletion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant that speaks like Marv." },
            { role: "user", content: message },
        ],
        model: "ft:gpt-3.5-turbo-1106:personal::8S4LSBpS",
    });

    console.log("Standard Model Response:", standardModelCompletion.choices[0].message.content);
    console.log("Fine-tuned Model Response:", fineTunedCompletion.choices[0].message.content);
}

async function main() {
    // await upload_finetuding_dataset();
    // await list_files();
    // await load_fine_tuned_model2();
    // control_models();
    // use_fine_tuned_model("Marv, What's the capital of France?");
    compare_models("What's the capital of France?");
    compare_models("한국의 수도는 어디야?");
}

main();
