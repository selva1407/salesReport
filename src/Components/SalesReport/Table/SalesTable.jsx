import TBody from "./TBody"
import "./SalesTable.css"
const SalesTable = ({data,fetchError, isLoading, currentPage, postPerPage}) => {
  
  return (
    <>
      <table className = "salesTable">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Vch No</th>
            <th>Customer</th>
            <th>Voucher Type</th>
            <th>Ledger Group</th>
            <th>Taxable Amount</th>
            <th>Tax Amount</th>
            <th>Invoice Amount</th>
          </tr>
        </thead>
        <tbody>
            {isLoading && (
            <tr>
              <td colSpan = "5" className = "sales-loading">Loading...</td>
            </tr>
            )}
            {fetchError && (
            <tr>
              <td colSpan = "5">{fetchError}</td>
            </tr>
            )}
            {!data?.length && !isLoading && (
              <tr>
              <td colSpan = "5" className = "sales-loading">Data not found</td>
            </tr>
            )}
            {!isLoading && !fetchError  &&
            (<TBody 
              data = {data}
              currentPage = {currentPage}
              postPerPage = {postPerPage}
            />)}
        </tbody>
      </table>
    </>
  )
}
export default SalesTable;