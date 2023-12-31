function TransferCanvastoJpg(blur: HTMLCanvasElement, filename: string) {
  const image = blur.toDataURL('image/jpeg', 1.0);
  const link = document.createElement('a');
  link.download = filename;
  link.href = image;
  link.click();

  const blobBin = atob(image.split(',')[1]); // base64 데이터 디코딩
  const array = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  const mozaicfile = new File([blob], filename, { type: 'image/jpeg' });
  const formdata = new FormData(); // formData 생성
  formdata.append('file', mozaicfile); // file data 추가
  return formdata;
}
export default TransferCanvastoJpg;
