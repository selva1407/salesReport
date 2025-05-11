

const TBody = ({data, currentPage, postPerPage}) => {
  
  const handleAmount = (amount) => {
    const value = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(amount);
    return value;
  }
  
  return (
    <>
      {
        data.map((data, index) => (
          <tr key = {data.VchId || index}>
            <td>{(currentPage) * postPerPage + index + 1}</td>
            <td className = "date">{data.DATE}</td>
            <td className = "vchNo">{data.VOUCHERNUMBER}</td>
            <td className = "party">{data.PARTYNAME}</td>
            <td>{data.VOUCHERTYPENAME}</td>
            <td>{data.LEDGERGROUP}</td>
            <td className = "amount">{handleAmount(data.TAXABLEAMOUNT)}</td>
            <td className ="amount">{handleAmount(data.TAXAMOUNT)}</td>
            <td className = "amount">{handleAmount(data.Invoiceamount)}</td>
          </tr>
        ))
      }
    </>
  )
}
export default TBody;