import { GraphQLError } from "graphql";

type AddressCoordinateInput = {
  latitude?: number | null;
  longitude?: number | null;
};

export const validateAddressCoordinates = (
  address: AddressCoordinateInput
): void => {
  const hasLatitude =
    address.latitude !== null && address.latitude !== undefined;
  const hasLongitude =
    address.longitude !== null && address.longitude !== undefined;

  if (hasLatitude !== hasLongitude) {
    throw new GraphQLError(
      "Latitude and longitude must be provided together or both omitted.",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  if (hasLatitude && address.latitude! >= -90 && address.latitude! <= 90) {
    // valid range
  } else if (hasLatitude) {
    throw new GraphQLError("Latitude must be between -90 and 90.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (hasLongitude && address.longitude! >= -180 && address.longitude! <= 180) {
    // valid range
  } else if (hasLongitude) {
    throw new GraphQLError("Longitude must be between -180 and 180.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
};
