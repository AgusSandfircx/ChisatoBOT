import Canvas from "canvas";
import GIFEncoder from "gifencoder";
import petPetGif from "pet-pet-gif";
import fs from "fs";
import Axios from "axios";
import AI2D from "@arugaz/ai2d";

export class Sticker {
    static Anime = async (buffer: Buffer) => {
        try {
            const result = await AI2D(buffer, {
                proxy: process.env.PROXY,
                crop: "SINGLE",
            });
            return result;
        } catch (e) {
            return e;
        }
    };

    static Trigger = async (image: Buffer) => {
        try {
            const TRIGGERED = fs.readFileSync("./media/trigger.png");
            const Base = await Canvas.loadImage(TRIGGERED);
            const Image = await Canvas.loadImage(image);
            const GIF = new GIFEncoder(256, 310);
            GIF.start();
            GIF.setRepeat(0);
            GIF.setDelay(15);
            const canvas = Canvas.createCanvas(256, 310);
            const ctx = canvas.getContext("2d");
            const BR = 30;
            const LR = 20;
            let i = 0;
            while (i < 9) {
                ctx.clearRect(0, 0, 256, 310);
                ctx.drawImage(
                    Image,
                    Math.floor(Math.random() * BR) - BR,
                    Math.floor(Math.random() * BR) - BR,
                    256 + BR,
                    310 - 54 + BR
                );
                ctx.fillStyle = "#FF000033";
                ctx.fillRect(0, 0, 256, 310);
                ctx.drawImage(
                    Base,
                    Math.floor(Math.random() * LR) - LR,
                    310 - 54 + Math.floor(Math.random() * LR) - LR,
                    256 + LR,
                    54 + LR
                );
                GIF.addFrame(ctx);
                i++;
            }
            GIF.finish();
            return GIF.out.getData();
        } catch (e) {
            console.log(e);
        }
    };

    static Pet = async (param: string, filename: string) => {
        let animatedGif = await petPetGif(param);
        fs.writeFileSync(filename, animatedGif);
        return filename;
    };

    static emojiMix = async (emoji1: string, emoji2: string) => {
        return new Promise(async (resolve, reject) => {
            await Axios.get(
                `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
                    emoji1
                )}_${encodeURIComponent(emoji2)}`
            )
                .then(({ data }) => {
                    if (data.results.length === 0) {
                        resolve({
                            error: `${emoji1} and ${emoji2} cannot be combined! Try different emojis...`,
                            message: `${emoji1} and ${emoji2} cannot be combined! Try different emojis...`,
                        });
                    }
                    resolve({ url: data.results[0].url });
                })
                .catch((e) => reject(e));
        });
    };

    static memeGen = async (top: string, bottom: string, url: string) => {
        return new Promise(async (resolve, reject) => {
            await Axios.get(`https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${url}`, {
                headers: {
                    DNT: 1,
                    "Upgrade-Insecure-Request": 1,
                },
                responseType: "arraybuffer",
            })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((e) => reject(e));
        });
    };
}
