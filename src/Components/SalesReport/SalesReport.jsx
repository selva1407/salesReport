import { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import "./SalesReport.css";
import SalesTable from "./Table/SalesTable"
import { addDays, startOfMonth, endOfMonth } from "date-fns";
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import DateRangeComponent from "./DateRangeComponent/DateRangeComponent"
import VoucherTypeFilter from "./VoucherTypeFilter/VoucherTypeFilter"
import SalesItemPieChart from "./SalesItemPieChart/SalesItemPieChart"

const SalesReport = () => {
  
  const API_URL = import.meta.env.VITE_APIURL;
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [postPerPage, setPostPerPage] = useState(25)
  
  const [partyOptions, setPartyOptions] = useState([]);
  const [partySelect, setPartySelect] = useState("");
  
  const [vchTypeOptions, setVchTypeOptions] = useState([]);
  const [vchTypeSelect, setVchTypeSelect] = useState("");
  
  const [range, setRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection'
    }
  ])
  
  const [pieChartZoom, setPieChartZoom] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL)
        if(!response.ok) throw new Error("Failed to fetch data")
        const result = await response.json()
        setData(result)
        
        const partyListOption = Array.from(
        new Map(result.map((item) => [item.PARTYNAME, { value: item.PARTYNAME, label: item.PARTYNAME }])).values()
        );
        setPartyOptions(partyListOption);
        
        const vchTypeList = Array.from(new Map(result.map((item) => [item.VOUCHERTYPENAME, {value:item.VOUCHERTYPENAME}])).values());
        setVchTypeOptions(vchTypeList);
      }catch(err) {
        setFetchError(err.message)
      }finally {
        setIsLoading(false)
      }
    }
    /*setTimeout(() => {
      fetchData();
    },2000)*/
    fetchData();
  },[])
  
  useEffect(() => {
  setCurrentPage(0);
}, [partySelect,range]);
  
  const indexOfLastPost = (currentPage + 1) * postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage
  
  const filteredData = data.filter((item) => !partySelect || item.PARTYNAME === partySelect).filter((item) => !vchTypeSelect || item.VOUCHERTYPENAME === vchTypeSelect);
  
  /*const currentPost = data.slice(indexOfFirstPost, indexOfLastPost)
  */
  
  const filteredByDate = filteredData.filter(item => {
    const [day, month, year] = item.DATE.split('-').map(Number);
  const itemDate = new Date(year, month - 1, day); // month -1 because JavaScript months are 0-indexed
    return itemDate >= range[0].startDate && itemDate <= range[0].endDate;
  })
  .sort((a, b) => {
    const [dayA, monthA, yearA] = a.DATE.split('-').map(Number);
    const [dayB, monthB, yearB] = b.DATE.split('-').map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    // For ascending order
    return dateB - dateA;

    // For descending order, reverse it:
    // return dateB - dateA;
  });
  
  const currentPost = filteredByDate.slice(indexOfFirstPost, indexOfLastPost);
  
  const totalPages = Math.ceil(filteredByDate.length / postPerPage)
  
  const paginate = (page) => setCurrentPage(page);
  
  const handlePageClick = (e) => {
    
    setCurrentPage(e.selected)
  }
  
  const defaultPartySelect = {
    value:"",
    label:"All Paryies"
  }
  const optionWithDefaultPartySelect = [defaultPartySelect, ...partyOptions]
  
  return (
    <main className = "main">
      <h1>Sales Analysis</h1>
      <SalesItemPieChart 
        salesData = {data}
        pieChartZoom = {pieChartZoom}
        setPieChartZoom = {setPieChartZoom}
      />
      {pieChartZoom && (
        <div className ="sales-Item-pie-container">
          <div className ="sales-Item-pie-zoom">
            <SalesItemPieChart 
              salesData = {data}
              pieChartZoom = {pieChartZoom}
              setPieChartZoom = {setPieChartZoom}
            />
          </div>
        </div>)}
      <form className = "filter-form">
        <Select 
          className = "select"
          placeholder = "Select Customer"
          options = {optionWithDefaultPartySelect}
          value = {optionWithDefaultPartySelect.find(option => option.value === partySelect)}
          onChange = {(option) => setPartySelect(option.value || "")}
        />
        <DateRangeComponent 
          range = {range}
          setRange = {setRange}
        />
        <VoucherTypeFilter 
          vchTypeOptions = {vchTypeOptions}
          setVchTypeOptions = {setVchTypeOptions}
          vchTypeSelect = {vchTypeSelect}
          setVchTypeSelect = {setVchTypeSelect}
        />
      </form>
      <section className = "table-container">
        <SalesTable
          data = {currentPost}
          fetchError = {fetchError}
          isLoading = {isLoading}
          currentPage = {currentPage}
          postPerPage = {postPerPage}
        />
      </section>
      <section className = "sales-total">
        <p>{`Total : ${filteredByDate.length}`}</p>
        <div>
          {filteredByDate.length !== 0 && (
            <input
              min={1}
              max={totalPages}
              value={currentPage + 1}
              onChange={(e) => setCurrentPage(e.target.value -1) // convert to 0-based
                }
            />
          )}
          <ReactPaginate 
            previousLabel = {"<<"}
            nextLabel = {">>"}
            breakLabel = {"..."}
            pageCount = {totalPages}
            marginPagesDisplayed = {1}
            pageRangeDisplayed = {3}
            onPageChange = {handlePageClick}
            containerClassName = {"pagination"}
            renderOnZeroPageCount={null}
            activeClassName = {"paginate-active"}
            forcePage={currentPage}
          />
        </div>
      </section>
    </main>
  )
}
export default SalesReport