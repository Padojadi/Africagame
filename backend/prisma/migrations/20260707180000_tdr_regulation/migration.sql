-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EXPLOITANT', 'REGULATEUR', 'OPERATEUR');
CREATE TYPE "Channel" AS ENUM ('RETAIL', 'ONLINE', 'USSD', 'SMS');
CREATE TYPE "PaymentNature" AS ENUM ('DEPOT', 'RETRAIT');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'ERROR', 'EXPIRED', 'OUTSIDE_CONCENTRATOR');
CREATE TYPE "BetNature" AS ENUM ('PRISE_PARI', 'PAIEMENT', 'ANNULATION', 'CASHOUT');
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'CASHOUT', 'EXPIRED', 'CANCELLED');
CREATE TYPE "GameType" AS ENUM ('SPORT', 'HIPPIQUE', 'VIRTUEL', 'CASINO', 'LOTO', 'OTHER');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VALIDATE', 'REJECT', 'EXPORT', 'CONFIGURE');
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 2,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Jurisdiction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(5) NOT NULL,
    "currencyId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Abidjan',
    "defaultLanguage" TEXT NOT NULL DEFAULT 'fr',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "dataRetentionMonths" INTEGER NOT NULL DEFAULT 18,
    "archiveYears" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Jurisdiction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JurisdictionChannel" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "JurisdictionChannel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "jurisdictionId" TEXT,
    "gameOperatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GameOperator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "jurisdictionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GameOperator_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MOBILE_MONEY',
    "jurisdictionId" TEXT NOT NULL,
    "config" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentProvider_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RegulatoryRule" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseType" TEXT NOT NULL DEFAULT 'PBJ',
    "rate" DECIMAL(8,4) NOT NULL,
    "threshold" DECIMAL(18,2),
    "periodicity" TEXT NOT NULL DEFAULT 'MONTHLY',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RegulatoryRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "idempotencyKey" TEXT,
    "jurisdictionId" TEXT NOT NULL,
    "gameOperatorId" TEXT NOT NULL,
    "nature" "PaymentNature" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "msisdn" TEXT,
    "sessionId" TEXT,
    "actorRef" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "outsideConcentrator" BOOLEAN NOT NULL DEFAULT false,
    "operatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentStep" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "stepType" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentStep_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BetTransaction" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "idempotencyKey" TEXT,
    "jurisdictionId" TEXT NOT NULL,
    "gameOperatorId" TEXT NOT NULL,
    "nature" "BetNature" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "msisdn" TEXT,
    "gameType" "GameType" NOT NULL,
    "actorRef" TEXT,
    "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
    "undeclared" BOOLEAN NOT NULL DEFAULT false,
    "operatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BetTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "gameOperatorId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "pbjAmount" DECIMAL(18,2) NOT NULL,
    "levyAmount" DECIMAL(18,2) NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResponsibleGamingProfile" (
    "id" TEXT NOT NULL,
    "msisdn" TEXT,
    "playerRef" TEXT,
    "jurisdictionId" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "totalDeposits" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalBets" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResponsibleGamingProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UssdSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "msisdn" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "gameOperatorId" TEXT,
    "channel" "Channel" NOT NULL DEFAULT 'USSD',
    "currentStep" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UssdSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SmsMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "msisdn" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "keyword" TEXT,
    "body" TEXT NOT NULL,
    "dlrStatus" TEXT,
    "correlatedId" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SmsMessage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");
CREATE UNIQUE INDEX "Jurisdiction_code_key" ON "Jurisdiction"("code");
CREATE UNIQUE INDEX "JurisdictionChannel_jurisdictionId_channel_key" ON "JurisdictionChannel"("jurisdictionId", "channel");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "GameOperator_apiKey_key" ON "GameOperator"("apiKey");
CREATE UNIQUE INDEX "GameOperator_jurisdictionId_licenseNumber_key" ON "GameOperator"("jurisdictionId", "licenseNumber");
CREATE UNIQUE INDEX "PaymentProvider_jurisdictionId_code_key" ON "PaymentProvider"("jurisdictionId", "code");
CREATE UNIQUE INDEX "PaymentTransaction_idempotencyKey_key" ON "PaymentTransaction"("idempotencyKey");
CREATE UNIQUE INDEX "BetTransaction_idempotencyKey_key" ON "BetTransaction"("idempotencyKey");
CREATE UNIQUE INDEX "UssdSession_sessionId_key" ON "UssdSession"("sessionId");
CREATE UNIQUE INDEX "SmsMessage_messageId_key" ON "SmsMessage"("messageId");

CREATE INDEX "PaymentTransaction_jurisdictionId_operatedAt_idx" ON "PaymentTransaction"("jurisdictionId", "operatedAt");
CREATE INDEX "PaymentTransaction_gameOperatorId_operatedAt_idx" ON "PaymentTransaction"("gameOperatorId", "operatedAt");
CREATE INDEX "PaymentTransaction_msisdn_idx" ON "PaymentTransaction"("msisdn");
CREATE INDEX "PaymentTransaction_channel_idx" ON "PaymentTransaction"("channel");
CREATE INDEX "BetTransaction_jurisdictionId_operatedAt_idx" ON "BetTransaction"("jurisdictionId", "operatedAt");
CREATE INDEX "BetTransaction_gameOperatorId_operatedAt_idx" ON "BetTransaction"("gameOperatorId", "operatedAt");
CREATE INDEX "BetTransaction_msisdn_idx" ON "BetTransaction"("msisdn");
CREATE INDEX "BetTransaction_channel_idx" ON "BetTransaction"("channel");
CREATE INDEX "ResponsibleGamingProfile_msisdn_idx" ON "ResponsibleGamingProfile"("msisdn");
CREATE INDEX "ResponsibleGamingProfile_jurisdictionId_riskLevel_idx" ON "ResponsibleGamingProfile"("jurisdictionId", "riskLevel");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
CREATE INDEX "UssdSession_msisdn_idx" ON "UssdSession"("msisdn");
CREATE INDEX "UssdSession_expiresAt_idx" ON "UssdSession"("expiresAt");
CREATE INDEX "SmsMessage_msisdn_idx" ON "SmsMessage"("msisdn");
CREATE INDEX "SmsMessage_messageId_idx" ON "SmsMessage"("messageId");

ALTER TABLE "Jurisdiction" ADD CONSTRAINT "Jurisdiction_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "JurisdictionChannel" ADD CONSTRAINT "JurisdictionChannel_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_gameOperatorId_fkey" FOREIGN KEY ("gameOperatorId") REFERENCES "GameOperator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GameOperator" ADD CONSTRAINT "GameOperator_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentProvider" ADD CONSTRAINT "PaymentProvider_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RegulatoryRule" ADD CONSTRAINT "RegulatoryRule_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_gameOperatorId_fkey" FOREIGN KEY ("gameOperatorId") REFERENCES "GameOperator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentStep" ADD CONSTRAINT "PaymentStep_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BetTransaction" ADD CONSTRAINT "BetTransaction_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BetTransaction" ADD CONSTRAINT "BetTransaction_gameOperatorId_fkey" FOREIGN KEY ("gameOperatorId") REFERENCES "GameOperator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_gameOperatorId_fkey" FOREIGN KEY ("gameOperatorId") REFERENCES "GameOperator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
