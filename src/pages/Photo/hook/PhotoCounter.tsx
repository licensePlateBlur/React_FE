function PhotoCounter(props : any)
{
    const label =[0,0,0,0]
    // eslint-disable-next-line array-callback-return
    props.map( (data : any) =>
          {
            if(data.name === '0')
            {
            label[0] += 1;
            }
            else if (data.name === "Mobile phone")
            {
            label[1] += 1;
            }
            else if (data.name === "card")
            {
            label[2] += 1;
            }
            else if(data.name ==="license-plate")
            {
            label[3] += 1;
            }
          })
    return label
}
export default PhotoCounter