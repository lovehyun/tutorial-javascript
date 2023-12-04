const OpenAI = require('openai');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// OpenAI 셋업
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const train_data = './data/example_health_trainer_ko.jsonl';
const train_basemodel = 'gpt-3.5-turbo';

// 메인 파인튜닝 코드 - 쇼트버전
async function mainShort() {
    let file = await openai.files.create({
        file: fs.createReadStream(train_data),
        purpose: 'fine-tune',
    });

    let fineTune = await openai.fineTuning.jobs.create({
        model: 'gpt-3.5-turbo-1106',
        training_file: file.id,
    });
}

// 메인 파인튜닝 코드 with 결과 출력
async function main() {
    console.log(`Step1. Uploading file`);

    let file = await openai.files.create({
        file: fs.createReadStream(train_data),
        purpose: 'fine-tune',
    });
    console.log(`Uploaded file with ID: ${file.id}`);
    console.log('-----');

    console.log(`Step2. Waiting for file to be processed...`);
    while (true) {
        file = await openai.files.retrieve(file.id);
        console.log(`File status: ${file.status}`);

        if (file.status === 'processed') {
            break;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    console.log('-----');

    console.log(`Step3. Starting fine-tuning`);
    let fineTune = await openai.fineTuning.jobs.create({ model: train_basemodel, training_file: file.id });
    console.log(`Fine-tuning ID: ${fineTune.id}`);
    console.log('-----');

    console.log(`Step4. Track fine-tuning progress...`);
    let after;
    while (fineTune.status !== 'succeeded') {
        fineTune = await openai.fineTuning.jobs.retrieve(fineTune.id);
        console.log(`${fineTune.status}`);

        const options = after ? { limit: 50, after } : { limit: 50 };
        const events = await openai.fineTuning.jobs.listEvents(fineTune.id, options);
        for (const event of events.data.reverse()) {
            console.log(`- ${event.created_at}: ${event.message}`);
        }

        if (events.data.length > 0) {
            after = events.data[events.data.length - 1]?.id;
            console.log(after);
        }

        await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    console.log('-----');
    console.log(`Step5. Fine-tuning completed successfully.`);
    console.log(`Fine-tuned model name: ${fineTune.model}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
