import {
  OrganizationType,
  PrismaClient,
  SupplierStatus,
} from "@prisma/client";

export async function seedSuppliers(prisma: PrismaClient) {
  console.log("Seeding organizations + suppliers + addresses...");

  const supplierData = [
    {
      organizationId: "org-supplier-1",
      supplierId: "supplier-1",
      name: "МедиЛаб Саплай Монголиа",
      description:
        "Эмнэлэг, лабораторид зориулсан анализатор, эрчимт эмчилгээний дэмжих төхөөрөмж, ариун хэрэглээний материалыг нийлүүлнэ.",
      logoUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      phone: "70115501",
      email: "contact@medilab.mn",
      website: "https://medilab.mn",
      status: SupplierStatus.ACTIVE,
      address: {
        id: "addr-supplier-1",
        address1: "Энхтайваны өргөн чөлөө 12",
        address2: "Сүхбаатар дүүрэг",
        province: "Улаанбаатар",
        latitude: 47.918873,
        longitude: 106.917701,
      },
    },
    {
      organizationId: "org-supplier-2",
      supplierId: "supplier-2",
      name: "Сентрал Хоспитал Системс",
      description:
        "Томоохон эмнэлгүүдэд зориулсан оношилгооны төхөөрөмж, өвчтөн хянах тоног төхөөрөмж, төвлөрсөн ариутгалын шийдлийг нийлүүлнэ.",
      logoUrl:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
      phone: "70115502",
      email: "hello@centralhospital.mn",
      website: "https://centralhospital.mn",
      status: SupplierStatus.PENDING_VERIFICATION,
      address: {
        id: "addr-supplier-2",
        address1: "Олимпын гудамж 8",
        address2: "Баянзүрх дүүрэг",
        province: "Улаанбаатар",
        latitude: 47.913,
        longitude: 106.985,
      },
    },
  ];

  const upserts = supplierData.map((supplier) =>
    prisma.organization.upsert({
      where: { id: supplier.organizationId },
      update: {
        name: supplier.name,
        type: OrganizationType.SUPPLIER,
        supplier: {
          upsert: {
            create: {
              id: supplier.supplierId,
              description: supplier.description,
              logoUrl: supplier.logoUrl,
              phone: supplier.phone,
              email: supplier.email,
              website: supplier.website,
              status: supplier.status,
            },
            update: {
              description: supplier.description,
              logoUrl: supplier.logoUrl,
              phone: supplier.phone,
              email: supplier.email,
              website: supplier.website,
              status: supplier.status,
            },
          },
        },
        address: {
          upsert: {
            create: supplier.address,
            update: {
              address1: supplier.address.address1,
              address2: supplier.address.address2,
              province: supplier.address.province,
              latitude: supplier.address.latitude,
              longitude: supplier.address.longitude,
            },
          },
        },
      },
      create: {
        id: supplier.organizationId,
        name: supplier.name,
        type: OrganizationType.SUPPLIER,
        supplier: {
          create: {
            id: supplier.supplierId,
            description: supplier.description,
            logoUrl: supplier.logoUrl,
            phone: supplier.phone,
            email: supplier.email,
            website: supplier.website,
            status: supplier.status,
          },
        },
        address: {
          create: supplier.address,
        },
      },
    }),
  );

  await prisma.$transaction(upserts);
  console.log("Organizations + suppliers + addresses seeded successfully!");
}
