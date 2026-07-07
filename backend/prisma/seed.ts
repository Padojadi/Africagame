import { PrismaClient, UserRole, Channel, PaymentNature, PaymentStatus, BetNature, BetStatus, GameType, RiskLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const currencies = [
  { code: 'XOF', name: 'Franc CFA BCEAO', symbol: 'FCFA', decimals: 0 },
  { code: 'XAF', name: 'Franc CFA BEAC', symbol: 'FCFA', decimals: 0 },
  { code: 'NGN', name: 'Naira nigérian', symbol: '₦', decimals: 2 },
  { code: 'GHS', name: 'Cedi ghanéen', symbol: 'GH₵', decimals: 2 },
  { code: 'KES', name: 'Shilling kényan', symbol: 'KSh', decimals: 2 },
  { code: 'TZS', name: 'Shilling tanzanien', symbol: 'TSh', decimals: 2 },
  { code: 'UGX', name: 'Shilling ougandais', symbol: 'USh', decimals: 0 },
  { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', decimals: 2 },
  { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£', decimals: 2 },
  { code: 'MAD', name: 'Dirham marocain', symbol: 'MAD', decimals: 2 },
];

const jurisdictions = [
  { name: 'Sénégal', code: 'SEN', currency: 'XOF', timezone: 'Africa/Dakar' },
  { name: "Côte d'Ivoire", code: 'CIV', currency: 'XOF', timezone: 'Africa/Abidjan' },
  { name: 'Cameroun', code: 'CMR', currency: 'XAF', timezone: 'Africa/Douala' },
  { name: 'Nigeria', code: 'NGA', currency: 'NGN', timezone: 'Africa/Lagos' },
  { name: 'Ghana', code: 'GHA', currency: 'GHS', timezone: 'Africa/Accra' },
  { name: 'Kenya', code: 'KEN', currency: 'KES', timezone: 'Africa/Nairobi' },
];

async function main() {
  for (const c of currencies) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  for (const j of jurisdictions) {
    const currency = await prisma.currency.findUnique({ where: { code: j.currency } });
    if (!currency) continue;
    const jurisdiction = await prisma.jurisdiction.upsert({
      where: { code: j.code },
      update: {},
      create: {
        name: j.name,
        code: j.code,
        currencyId: currency.id,
        timezone: j.timezone,
        defaultLanguage: 'fr',
      },
    });

    for (const ch of ['RETAIL', 'ONLINE', 'USSD', 'SMS'] as Channel[]) {
      await prisma.jurisdictionChannel.upsert({
        where: { jurisdictionId_channel: { jurisdictionId: jurisdiction.id, channel: ch } },
        update: {},
        create: { jurisdictionId: jurisdiction.id, channel: ch, enabled: true },
      });
    }

    await prisma.regulatoryRule.upsert({
      where: { id: `${j.code}-pbj-default` },
      update: {},
      create: {
        id: `${j.code}-pbj-default`,
        jurisdictionId: jurisdiction.id,
        name: 'Prélèvement PBJ standard',
        baseType: 'PBJ',
        rate: 0.15,
        periodicity: 'MONTHLY',
      },
    });

    const providers = [
      { name: 'Orange Money', code: 'ORANGE_MONEY' },
      { name: 'MTN MoMo', code: 'MTN_MOMO' },
      { name: 'Wave', code: 'WAVE' },
      { name: 'M-Pesa', code: 'MPESA' },
    ];
    for (const p of providers) {
      await prisma.paymentProvider.upsert({
        where: { jurisdictionId_code: { jurisdictionId: jurisdiction.id, code: p.code } },
        update: {},
        create: { ...p, jurisdictionId: jurisdiction.id },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@africagame.2ticglobal.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Africagame!@#2026';
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashed, role: UserRole.EXPLOITANT, active: true },
    create: {
      email: adminEmail,
      password: hashed,
      firstName: 'Admin',
      lastName: 'Exploitant',
      role: UserRole.EXPLOITANT,
      active: true,
    },
  });

  const senegal = await prisma.jurisdiction.findUnique({ where: { code: 'SEN' } });
  if (senegal) {
    const regulatorEmail = 'regulateur@africagame.2ticglobal.com';
    await prisma.user.upsert({
      where: { email: regulatorEmail },
      update: {},
      create: {
        email: regulatorEmail,
        password: await bcrypt.hash('Regulateur!2026', 12),
        firstName: 'Régulateur',
        lastName: 'Sénégal',
        role: UserRole.REGULATEUR,
        jurisdictionId: senegal.id,
        active: true,
      },
    });

    const operator = await prisma.gameOperator.upsert({
      where: { jurisdictionId_licenseNumber: { jurisdictionId: senegal.id, licenseNumber: 'LIC-SEN-001' } },
      update: {},
      create: {
        name: 'Opérateur Démo Sénégal',
        licenseNumber: 'LIC-SEN-001',
        jurisdictionId: senegal.id,
        apiKey: randomUUID(),
      },
    });

    await prisma.user.upsert({
      where: { email: 'operateur@africagame.2ticglobal.com' },
      update: {},
      create: {
        email: 'operateur@africagame.2ticglobal.com',
        password: await bcrypt.hash('Operateur!2026', 12),
        firstName: 'Opérateur',
        lastName: 'Démo',
        role: UserRole.OPERATEUR,
        jurisdictionId: senegal.id,
        gameOperatorId: operator.id,
        active: true,
      },
    });

    // Sample transactions
    await prisma.paymentTransaction.createMany({
      data: [
        {
          jurisdictionId: senegal.id,
          gameOperatorId: operator.id,
          nature: PaymentNature.DEPOT,
          amount: 5000,
          currencyCode: 'XOF',
          channel: Channel.USSD,
          msisdn: '+221771234567',
          sessionId: randomUUID(),
          status: PaymentStatus.SUCCESS,
          actorRef: 'player-001',
        },
        {
          jurisdictionId: senegal.id,
          gameOperatorId: operator.id,
          nature: PaymentNature.RETRAIT,
          amount: 2500,
          currencyCode: 'XOF',
          channel: Channel.ONLINE,
          status: PaymentStatus.SUCCESS,
          actorRef: 'player-002',
        },
      ],
      skipDuplicates: true,
    });

    await prisma.betTransaction.createMany({
      data: [
        {
          jurisdictionId: senegal.id,
          gameOperatorId: operator.id,
          nature: BetNature.PRISE_PARI,
          amount: 1000,
          currencyCode: 'XOF',
          channel: Channel.SMS,
          msisdn: '+221771234567',
          gameType: GameType.SPORT,
          status: BetStatus.PENDING,
        },
        {
          jurisdictionId: senegal.id,
          gameOperatorId: operator.id,
          nature: BetNature.PRISE_PARI,
          amount: 2000,
          currencyCode: 'XOF',
          channel: Channel.RETAIL,
          gameType: GameType.HIPPIQUE,
          status: BetStatus.WON,
          actorRef: 'agent-001',
        },
      ],
      skipDuplicates: true,
    });

    await prisma.responsibleGamingProfile.upsert({
      where: { id: 'rg-demo-001' },
      update: {},
      create: {
        id: 'rg-demo-001',
        msisdn: '+221771234567',
        jurisdictionId: senegal.id,
        riskLevel: RiskLevel.MEDIUM,
        totalDeposits: 50000,
        totalBets: 35000,
        notes: 'Parieur identifié via MSISDN USSD — surveillance active',
      },
    });
  }

  console.log('Seed TDR régulation terminé. Admin:', adminEmail);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
