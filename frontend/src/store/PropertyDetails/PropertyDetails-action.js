import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

export const getPropertyDetails = (id) => async (dispatch) => {
    try {
        dispatch(propertyDetailsAction.getListRequest());
        const response = await axiosInstance.get(`/v1/rent/listing/${id}`);
        const { data } = response.data;

        if (!data) {
            throw new Error("Property details were not found.");
        }

        dispatch(propertyDetailsAction.getPropertyDetails(data));
    } catch (error) {
        const message =
            error.response?.data?.error ??
            error.response?.data?.message ??
            error.message ??
            "Could not fetch property details.";
        dispatch(propertyDetailsAction.getErrors(message));
    }
};
