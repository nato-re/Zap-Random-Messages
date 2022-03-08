import jimp from 'jimp';
import wa from '@open-wa/wa-automate';
import path from 'path';
import fs from 'fs';

const text = `Seu texto vai aqui, 
pode quebrar linhas
uhul`

const imagePath = 'C:/Users/gabri/Pictures/images.jpeg';

const contacts = ['kelly','Guerris','Gabi Hist']

function getImage() { // get random image
    return fs.readFileSync(imagePath)
}

(async function sendMessage() {
try {
    

    const url = getImage(); 
    // Read the fonts to write the image
    const font78 = await jimp.loadFont(path.resolve("fonts/font78.fnt"));
    const font28 = await jimp.loadFont(path.resolve("fonts/font28.fnt"));

    const client = await wa.create(); // connect with whatsapp web
    const contacts = await client.getAllContacts(); // get all contacts
    // aqui dá pra mandar pra todos, só trocar as menções de `amigos` por `contacts`
    const amigos = contacts.filter(c => c.name ? contacts.includes(c.name) : false); // filter the contacts

    for(let i = 0; i < amigos.length; i++) {// Create a custom message for each contact filtered above
        const img = await jimp.read(url); // read img from Url
        let newImg = await img.print(font28, 10, 10, "Bom dia"); // Add msg
        
        newImg = await img.print(font78, 3, 50, amigos[i].pushname + '...'); // Get the name in whatsapp
        newImg = await newImg.print(font28, 100, 300, 'e bom final de semana'); // Add msg
        
        const base64 = await newImg.getBase64Async(jimp.MIME_JPEG); // convert the image to base64
        await client.sendFile(amigos[i].id, base64, 'Bom dia.jpg', 'testando'); // Send the image
    }
} catch (error) {
    console.log(error);
}
})()

