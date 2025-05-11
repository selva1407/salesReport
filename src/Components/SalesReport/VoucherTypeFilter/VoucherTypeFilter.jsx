import "./VoucherTypeFilter.css"

const VoucherTypeFilter = ({vchTypeOptions, setVchTypeOptions, vchTypeSelect, setVchTypeSelect}) => {
  
  const handleVchTypeChange = (e) => {
    setVchTypeSelect(e.target.value);
  }
  
  return (
    <div>
      <select className = "voucherType" 
        value={vchTypeSelect} 
        onChange={handleVchTypeChange}
      >
        <option value="">All Voucher Types</option>
        {vchTypeOptions.map((opt) => (
          <option key={opt.value} 
            value={opt.value}>
            {opt.value}
          </option>
        ))}
      </select>
    </div>
  )
}
export default VoucherTypeFilter;