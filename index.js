// Jimmy Lionez

const { Client, GatewayIntentBits, Partials, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('./config.json');
const Logger = require('./utils/logger');
const FormLogger = require('./formLogger');
const formLogger = new FormLogger();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel]
});

const logger = new Logger(client, config.channelId);

client.once(Events.ClientReady, async () => {
  console.log(`✅ Login สำเร็จในชื่อ ${client.user.tag}`);

  const channel = await client.channels.fetch(config.channelId);

  // จับ Error และแจ้งใน Discord ผ่าน Logger
process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Rejection:', reason);
  await logger.sendErrorMessage(reason, 'Unhandled Promise Rejection');
});

client.on('error', async (error) => {
  console.error('💥 Client Error:', error);
  await logger.sendErrorMessage(error.message, 'Client Error');
});

// 🔥 ลบเฉพาะข้อความที่บอทเคยส่งเอง (สูงสุด 100 ข้อความล่าสุด)
const messages = await channel.messages.fetch({ limit: 100 });
const botMessages = messages.filter(msg => msg.author.id === client.user.id);

if (botMessages.size > 0) {
  try {
    const deleted = await channel.bulkDelete(botMessages, true);
    console.log(`🧹 ลบข้อความของบอทแล้ว (${deleted.size} ข้อความ)`);
    await logger.sendStartupMessage();
    await logger.sendInfoMessage(`🧹 ลบข้อความเก่าของบอทแล้วทั้งหมด ${deleted.size} ข้อความ`);
  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาดขณะลบข้อความของบอท:', err);
    await logger.sendErrorMessage(err.message, 'ลบข้อความไม่สำเร็จ');
  }
} else {
  console.log('ℹ️ ไม่พบข้อความที่บอทเคยส่ง');
  await logger.sendStartupMessage();
  await logger.sendInfoMessage('ℹ️ ไม่พบข้อความเก่าที่บอทเคยส่งในช่องนี้');
}


  const embed = new EmbedBuilder()
    .setThumbnail('...') // <-- เพิ่มรูปภาพตรงนี้
    .setTitle('📋 กรอกข้อมูลเพื่อรับ Whitelist  Fill in the information to receive Whitelist')
    .setDescription('\`\`\`\n เมื่อกรอกข้อมูลครบถ้วนแล้ว กรุณารอสักครู่ เพื่อให้ Admin ตรวจสอบข้อมูล หากผ่านการตรวจสอบแล้ว ท่านจะได้รับ Whitelist ทันที \n\`\`\` \`\`\`\n After completing the form, please wait a moment for the Admin to review your information. Once approved, you will receive the Whitelist immediately. \n\`\`\`')
    .setColor(0x00AE86)
    .setFooter({ text: 'Powered by Jimmy Lionez (Admin_Jimmy)' })
    .setImage('...'); // <-- เพิ่มรูปภาพด้านล่างตรงนี้

  const button = new ButtonBuilder()
    .setCustomId('whitelistBtn')
    .setLabel('📨 สมัคร Whitelist')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  await channel.send({ embeds: [embed], components: [row] });
  });

client.on(Events.InteractionCreate, async interaction => {
  
  // เมื่อผู้ใช้กดปุ่ม
  if (interaction.isButton() && interaction.customId === 'whitelistBtn') {
    const modal = new ModalBuilder()
      .setCustomId('whitelistModal')
      .setTitle('**กรอกข้อมูล Whitelist**');

    const ignInput = new TextInputBuilder()
      .setCustomId('ign')
      .setLabel('ชื่อ IC / Name IC')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const ageInput = new TextInputBuilder()
      .setCustomId('age')
      .setLabel('อายุ / Age')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const genderInput = new TextInputBuilder()
      .setCustomId('gender')
      .setLabel('เพศ / Gender (Male, Female , Other)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const steamhexInput = new TextInputBuilder()
      .setCustomId('steamhex')
      .setLabel('Steam HEX (steam:xxxxxxxxxxx)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

// Jimmy Lionez

    const row1 = new ActionRowBuilder().addComponents(ignInput);
    const row2 = new ActionRowBuilder().addComponents(ageInput);
    const row3 = new ActionRowBuilder().addComponents(genderInput);
    const row4 = new ActionRowBuilder().addComponents(steamhexInput);

    modal.addComponents(row1, row2, row3, row4);
    await interaction.showModal(modal);
  }

  // เมื่อส่งฟอร์ม

  if (interaction.isModalSubmit() && interaction.customId === 'whitelistModal') {
  const ign = interaction.fields.getTextInputValue('ign');
  const age = interaction.fields.getTextInputValue('age');
  const gender = interaction.fields.getTextInputValue('gender');
  const steamhex = interaction.fields.getTextInputValue('steamhex');
  
  // ตรวจสอบว่า ign ว่ามากกว่า 3 ตัวอักษรหรือไม่
  if (ign.trim().length < 3) {
  return interaction.reply({ content: '\`\`\`\n ❌ กรุณากรอกชื่อ IC อย่างน้อย 3 ตัวอักษร !! \n\`\`\`  \`\`\`\n ❌ Please enter the IC name with at least 3 characters !! \n\`\`\` ', flags: MessageFlags.Ephemeral });
}

  // ตรวจสอบว่า age เป็นตัวเลขเท่านั้น
  if (!/^\d+$/.test(age)) {
    return interaction.reply({ content: '\`\`\`\n ❌ กรุณากรอกอายุเป็นตัวเลขเท่านั้น !! \n\`\`\`  \`\`\`\n ❌ Please enter age as numbers only !! \n\`\`\` ', flags: MessageFlags.Ephemeral });
  }

  // ตรวจสอบ gender ให้เป็น Male, Female, หรือ Other เท่านั้น (case-insensitive)
  if (!/^(male|female|other|m|f|o)$/i.test(gender)) {
    return interaction.reply({ content: '\`\`\`\n ❌ กรุณากรอกเพศเป็น Male, Female หรือ Other เท่านั้น !! \n\`\`\`  \`\`\`\n ❌ Please enter gender as Male, Female, or Other only !! \n\`\`\` ', flags: MessageFlags.Ephemeral });
  }

  // ตรวจสอบ steamhex ให้เป็น steam:xxxxx เท่านั้น (case-insensitive)
  if (!/^(steam:([0-9a-f]{14,20}))$/i.test(steamhex)) {
    return interaction.reply({ content: '\`\`\`\n ❌ กรุณากรอกสตรีมเป็น steam:xxxxx เท่านั้น !! \n\`\`\`  \`\`\`\n ❌ Please enter the stream as steam:xxxxx only !! \n\`\`\` ', flags: MessageFlags.Ephemeral });
  }

  // ถ้าผ่าน validation ทั้งหมด ให้ทำขั้นตอนต่อไป
      
    // --- ตรงนี้! เพิ่มบันทึก log ---
    formLogger.logFormSubmission({
      userId: interaction.user.id,
      ign,
      age,
      gender,
      steamhex
    });
  // ...
}
// Jimmy Lionez
  if (interaction.isModalSubmit() && interaction.customId === 'whitelistModal') {
    const ign = interaction.fields.getTextInputValue('ign');
    const age = interaction.fields.getTextInputValue('age');
    const gender = interaction.fields.getTextInputValue('gender');
    const steamhex = interaction.fields.getTextInputValue('steamhex');

    const embed = new EmbedBuilder()
  .setTitle('📋 คำขอสมัคร Whitelist')
  .setColor(0x00AE86)
  .addFields(
    {
      name: '**👤 Discord ผู้สมัคร**',
      value: `**<@${interaction.user.id}>**`,
      inline: false,
    },
    {
      name: '**🎮 ชื่อ IC**',
      value: `\`\`\`\n${ign}\n\`\`\``,
      inline: false,
    },
    {
      name: '**🧓 อายุ**',
      value: `\`\`\`\n${age}\n\`\`\``,
      inline: false,
    },
    {
      name: '**🧑‍🤝‍🧑 เพศ**',
      value: `\`\`\`\n${gender}\n\`\`\``,
      inline: false,
    },
    {
      name: '**🌐 Steam HEX**',
      value: `\`\`\`\n${steamhex}\n\`\`\``,
      inline: false,
    }
  )
  .setTimestamp()
  .setFooter({ text: 'ระบบสมัคร Whitelist อัตโนมัติ' });

   // ใช้ชื่ออื่นไม่ให้ซ้ำ
  const reportChannel = await client.channels.fetch(config.whitelistReportChannelId);

  await reportChannel.send({
    content: `<@&...> <@&...> <@&...> <@&...>`, // ใส่ role ID ที่ต้องการ mention
    embeds: [embed]
  });

    // ให้ Role (ถ้ามี)
    if (config.roleId) {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      await member.roles.add(config.roleId);
    }

    await interaction.reply({ content: '\`\`\`\n ✅ ส่งแบบฟอร์มเรียบร้อยแล้ว ขอบคุณ! \n\`\`\`  \`\`\`\n ✅Your form has been submitted successfully. Thank you! \n\`\`\` ', flags: MessageFlags.Ephemeral });
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isModalSubmit() && interaction.customId === 'whitelistModal') {
    const ign = interaction.fields.getTextInputValue('ign');
    const age = interaction.fields.getTextInputValue('age');
    const gender = interaction.fields.getTextInputValue('gender');
    const steamhex = interaction.fields.getTextInputValue('steamhex');

    // ส่วนโค้ดอื่น ๆ เช่น validate, ส่ง embed, ตอบ interaction ...
  }
});

client.login(config.token);

// แจ้ง Error จาก process หรือ unhandled promise
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection:', reason);
  // ไม่ส่งข้อความแจ้งเตือนใน Discord
  // ถ้าต้องการเก็บ log อย่างอื่นเพิ่มได้ที่นี่
});

client.on('error', (error) => {
  console.error('💥 Client Error:', error);
  // ไม่ส่งข้อความแจ้งเตือนใน Discord
});

// Jimmy Lionez