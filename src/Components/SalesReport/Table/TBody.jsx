

const TBody = ({data, currentPage, postPerPage}) => {
  
  return (
    <>
      {
        data.map((data, index) => (
          <tr key = {data.VchId}>
            <td>{(currentPage - 1) * postPerPage + index + 1}</td>
            <td>{data.DATE}</td>
            <td>{data.VOUCHERNUMBER}</td>
            <td>{data.PARTYNAME}</td>
            <td>{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(data.Invoiceamount)}</td>
          </tr>
        ))
      }
    </>
  )
}
export default TBody;