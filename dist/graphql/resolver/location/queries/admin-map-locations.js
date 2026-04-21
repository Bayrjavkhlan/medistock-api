"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapLocations = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.AdminMapLocations = (0, nexus_1.queryField)("adminMapLocations", {
    type: types_1.AdminMapLocationsPayloadObjectType,
    resolve: async (_parent, _args, ctx) => {
        if (!ctx.reqUser?.user?.isPlatformAdmin) {
            throw errors_1.Errors.System.PERMISSION_DENIED();
        }
        const [hospitals, drugstores] = await Promise.all([
            ctx.prisma.hospital.findMany({
                where: {
                    organization: {
                        address: {
                            is: {
                                latitude: { not: null },
                                longitude: { not: null },
                            },
                        },
                    },
                },
                include: {
                    organization: {
                        include: {
                            address: true,
                        },
                    },
                },
                orderBy: { organization: { name: "asc" } },
            }),
            ctx.prisma.pharmacy.findMany({
                where: {
                    organization: {
                        address: {
                            is: {
                                latitude: { not: null },
                                longitude: { not: null },
                            },
                        },
                    },
                },
                include: {
                    organization: {
                        include: {
                            address: true,
                        },
                    },
                },
                orderBy: { organization: { name: "asc" } },
            }),
        ]);
        // Demo operating hours until schedule fields are modeled in the database.
        const getDemoHours = (type) => type === "hospital"
            ? { opensAt: "08:30", closesAt: "17:30" }
            : { opensAt: "09:00", closesAt: "21:00" };
        return {
            hospitals: hospitals.flatMap((hospital) => {
                const address = hospital.organization.address;
                if (address?.latitude == null || address.longitude == null)
                    return [];
                const hours = getDemoHours("hospital");
                return [
                    {
                        id: hospital.id,
                        name: hospital.organization.name,
                        type: "hospital",
                        address: address.address1,
                        address2: address.address2,
                        province: address.province,
                        opensAt: hours.opensAt,
                        closesAt: hours.closesAt,
                        latitude: address.latitude,
                        longitude: address.longitude,
                    },
                ];
            }),
            drugstores: drugstores.flatMap((pharmacy) => {
                const address = pharmacy.organization.address;
                if (address?.latitude == null || address.longitude == null)
                    return [];
                const hours = getDemoHours("drugstore");
                return [
                    {
                        id: pharmacy.id,
                        name: pharmacy.organization.name,
                        type: "drugstore",
                        address: address.address1,
                        address2: address.address2,
                        province: address.province,
                        opensAt: hours.opensAt,
                        closesAt: hours.closesAt,
                        latitude: address.latitude,
                        longitude: address.longitude,
                    },
                ];
            }),
        };
    },
});
//# sourceMappingURL=admin-map-locations.js.map