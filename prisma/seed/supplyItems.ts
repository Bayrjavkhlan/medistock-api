import {
  Prisma,
  PrismaClient,
  SupplyAvailabilityStatus,
  SupplyItemCategory,
} from "@prisma/client";

export async function seedSupplyItems(prisma: PrismaClient) {
  console.log("Seeding supply items...");

  const supplyItems: Prisma.SupplyItemCreateInput[] = [
    {
      id: "supply-1",
      name: "BioChem 240 клиник химийн анализатор",
      shortDescription:
        "Дунд ачаалалтай эмнэлгийн лабораторид зориулсан урвалжийн удирдлагатай ширээний анализатор.",
      description:
        "Дүүргийн эмнэлэг болон лавлагаа лабораторид зориулагдсан энэхүү анализатор нь биохимийн тогтмол шинжилгээ, автомат калибровк, LIS-тэй нийцтэй ажлын урсгалыг дэмжинэ.",
      category: SupplyItemCategory.LAB_ANALYZER,
      model: "BioChem 240",
      brand: "MediLab",
      manufacturer: "МедиЛаб Диагностикс",
      price: 28500,
      currency: "USD",
      availability: SupplyAvailabilityStatus.AVAILABLE,
      warranty: "24 сарын сэлбэг, үйлчилгээний баталгаа",
      contactInfo: "Борлуулалт: sales@medilab.mn | +976 70115501",
      imageUrls: [
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
      ],
      documentUrls: ["https://example.com/docs/biochem-240-brochure.pdf"],
      specifications: {
        "Нэг цагийн хүчин чадал": 240,
        "Сорьцын төрөл": ["Сийвэн", "Плазм", "Шээс"],
        "Холболт": ["LIS", "USB экспорт"],
      },
      supplier: { connect: { id: "supplier-1" } },
    },
    {
      id: "supply-2",
      name: "ICU олон үзүүлэлттэй өвчтөн хянах монитор",
      shortDescription:
        "Эрчимт эмчилгээ болон яаралтай тусламжийн тасагт зориулсан 12 инчийн орны дэргэдэх монитор.",
      description:
        "ECG, SpO2, NIBP, RESP болон температурын хяналтыг дэмжихээс гадна дохиоллын тохиргоо, төв станцтай холболттой.",
      category: SupplyItemCategory.PATIENT_MONITORING,
      model: "PM-12 Pro",
      brand: "CareAxis",
      manufacturer: "КэйрАксис Медикал",
      price: 4900,
      currency: "USD",
      availability: SupplyAvailabilityStatus.LIMITED,
      warranty: "18 сарын баталгаа",
      contactInfo: "Борлуулалт: sales@medilab.mn | +976 70115501",
      imageUrls: [
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
      ],
      documentUrls: ["https://example.com/docs/pm12-install-guide.pdf"],
      specifications: {
        "Дэлгэц": "12 инч TFT",
        "Зайны нөөц": "180 минут",
        "Ашиглах орчин": ["ICU", "ER", "Сэргээх өрөө"],
      },
      supplier: { connect: { id: "supplier-1" } },
    },
    {
      id: "supply-3",
      name: "Ариун мэс заслын ажилбарын багц",
      shortDescription:
        "Жижиг ажилбарт зориулсан нэг удаагийн ариун мэс заслын багц.",
      description:
        "Нэг өдрийн ажилбарт хэрэглэх даавуу, халаад, шингээгч алчуур болон зайлшгүй хэрэгцээт ариун нэг удаагийн хэрэгслийг багтаасан.",
      category: SupplyItemCategory.SURGICAL_SUPPLY,
      model: "SP-Set 05",
      brand: "CentralCare",
      manufacturer: "Сентрал Хоспитал Системс",
      price: 32,
      currency: "USD",
      availability: SupplyAvailabilityStatus.AVAILABLE,
      warranty: "Ариун хадгалалтын хугацаа 3 жил",
      contactInfo: "Холбоо барих: hello@centralhospital.mn | +976 70115502",
      imageUrls: [
        "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=1200&q=80",
      ],
      documentUrls: ["https://example.com/docs/surgical-pack-spec.pdf"],
      specifications: {
        "Багцын төрөл": "Жижиг ажилбар",
        "Ариутгал": "EO",
        "Доторх хэрэгслийн тоо": 18,
      },
      supplier: { connect: { id: "supplier-2" } },
    },
    {
      id: "supply-4",
      name: "110 литрийн автоклав ариутгалын төхөөрөмж",
      shortDescription:
        "CSSD болон лабораторийн ариутгалын ажлын урсгалд зориулсан шалны автоклав төхөөрөмж.",
      description:
        "Багаж, шилэн хэрэгсэл, савласан материалд зориулсан програмчлагдах уурын цикл болон дижитал тайланг дэмжинэ.",
      category: SupplyItemCategory.STERILIZATION,
      model: "Autoclave 110L",
      brand: "CentralCare",
      manufacturer: "Сентрал Хоспитал Системс",
      price: 12800,
      currency: "USD",
      availability: SupplyAvailabilityStatus.PREORDER,
      warranty: "12 сарын баталгаа",
      contactInfo: "Холбоо барих: hello@centralhospital.mn | +976 70115502",
      imageUrls: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      ],
      documentUrls: ["https://example.com/docs/autoclave-110l.pdf"],
      specifications: {
        "Камерын багтаамж (литр)": 110,
        "Цахилгаан": "380V",
        "Циклийн програм": 8,
      },
      supplier: { connect: { id: "supplier-2" } },
    },
  ];

  const upserts = supplyItems.map((item) =>
    prisma.supplyItem.upsert({
      where: { id: item.id },
      create: item,
      update: item,
    }),
  );

  await prisma.$transaction(upserts);
  console.log("Supply items seeded successfully.");
}
