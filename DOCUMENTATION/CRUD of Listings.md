## Model Creation
- First we added the listing model in schema.prisma
```sql
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(uuid())
  name           String
  email          String    @unique
  hashedPassword String
  emailVerified  DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  sessions       Session[]
  listings       Listing[] // 👈 User can post multiple listings

  @@map("users")
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  id         String   @id @default(uuid())
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Listing {
  id            String   @id @default(uuid())
  title         String
  description   String
  category      String    // PG, Flat, Dharmshala etc.
  subcategory   String    // Male PG, 2 BHK, etc.
  price         Int?
  isFree        Boolean   @default(false)
  genderAllowed String?   // Male / Female / All
  roomType      String?   // Shared / Private / Entire Place
  amenities     String[]  // Wi-Fi, AC, Meals etc.

  // 📍 Realistic Address Fields
  fullAddress   String?
  locality      String
  area          String?
  city          String
  district      String
  state         String
  pincode       String?

  // 🔗 Owner
  ownerId       String
  owner         User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  // ⏰ Metadata
  availableFrom DateTime?
  createdAt     DateTime @default(now())
}
```

- Define Category & Subcategory Constants (Centralized Config)
    - Create a `accommodation-categories.ts`:
        ```ts
        export const accommodationCategories = [
        {
            label: "PG / Hostel",
            value: "PG",
            subcategories: [
            "Male PG",
            "Female PG",
            "Shared Room PG",
            "Private Room PG",
            "With Food",
            "Without Food",
            ],
        },
        {
            label: "Flat / Room on Rent",
            value: "FLAT",
            subcategories: [
            "1 BHK",
            "2 BHK",
            "Shared Room",
            "Private Room",
            "Furnished",
            "Unfurnished",
            ],
        },
        {
            label: "Co-living",
            value: "CO_LIVING",
            subcategories: [
            "Private Room",
            "Shared Room",
            "Boys",
            "Girls",
            "Mixed",
            ],
        },
        {
            label: "Dormitory",
            value: "DORMITORY",
            subcategories: [
            "4-Bed",
            "6-Bed",
            "10-Bed",
            "AC",
            "Non-AC",
            ],
        },
        {
            label: "Dharmshala / Ashram",
            value: "DHARMSHALA",
            subcategories: [
            "Hindu",
            "Jain",
            "All Religions",
            "Private Room",
            "Shared Room",
            ],
        },
        {
            label: "Couchsurfing / Free Stay",
            value: "COUCHSURFING",
            subcategories: [
            "Room Sharing",
            "Sofa",
            "1–3 Days Max",
            "Verified Host",
            ],
        },
        {
            label: "Budget Hotel / Lodge",
            value: "HOTEL",
            subcategories: [
            "Single Room",
            "Double Room",
            "AC",
            "Non-AC",
            "Family Room",
            ],
        },
        {
            label: "Guest House",
            value: "GUEST_HOUSE",
            subcategories: [
            "Whole Property",
            "Room Only",
            "With Food",
            "Without Food",
            ],
        },
        {
            label: "Short Stay (Airbnb Style)",
            value: "SHORT_STAY",
            subcategories: [
            "Entire Place",
            "Private Room",
            "Studio",
            "Workation",
            ],
        },
        ]
        ```

