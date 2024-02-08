import ContactUs from "./contactUsSchema.js";

const createContactMessage = async (data) => {
  try {
    const createMessage = await ContactUs.create(data);
    return createMessage._id;
  } catch (error) {
    throw error;
  }
};

export default {
  createContactMessage,
};
