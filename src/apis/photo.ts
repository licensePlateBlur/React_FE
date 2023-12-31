import { Authapi } from './core';

export const photoupload = async (formdata: FormData) => {
  const response = await Authapi.post('detect_image', formdata);
  return response;
};

export const canvassave = async (formdata: FormData) => {
  const response = await Authapi.post('image_upload', formdata);
  return response;
};
