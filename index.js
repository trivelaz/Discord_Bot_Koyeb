const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("@discord-player/core");
const { useMainPlayer } = require("discord-player");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client);

client.once("ready", () => {
    console.log("✅ GMusic está online!");
});

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;
    const args = message.content.split(" ");
    const command = args.shift().toLowerCase();

    if (command === "-help") {
        message.reply("🎶 **Comandos do GMusic** 🎶\n\n" +
            "-play ou -p [URL/Nome] → Toca uma música\n" +
            "-stop → Para a música\n" +
            "-fila → Mostra a fila de reprodução\n" +
            "-leave → Sai do canal de voz");
    }

    if (command === "-play" || command === "-p") {
        if (!message.member.voice.channel) {
            return message.reply("❌ Entra num canal de voz primeiro!");
        }
        
        const query = args.join(" ");
        if (!query) return message.reply("❌ Especifica uma música!");
        
        const player = useMainPlayer();
        const { track } = await player.play(message.member.voice.channel, query, {
            requestedBy: message.author
        });
        message.reply(`🎵 A tocar agora: **${track.title}**`);
    }

    if (command === "-stop") {
        const queue = player.nodes.get(message.guild.id);
        if (!queue) return message.reply("❌ Não há música a tocar!");
        queue.delete();
        message.reply("⏹ Música parada!");
    }

    if (command === "-fila") {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.tracks.length) return message.reply("❌ A fila está vazia!");
        message.reply("🎶 **Fila de Reprodução:**\n" + queue.tracks.map((t, i) => `${i + 1}. ${t.title}`).join("\n"));
    }

    if (command === "-leave") {
        const queue = player.nodes.get(message.guild.id);
        if (queue) queue.delete();
        message.guild.me.voice.channel?.leave();
        message.reply("👋 GMusic saiu do canal de voz!");
    }
});

client.login("ODkyMTExMzkyNzM4NTQxNjA4.GIaX59.NIysZaI3WqQGZnEeHnY0_FGQlUwMrLZL69wyIs");
