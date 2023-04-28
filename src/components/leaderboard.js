import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup"
import Pagination from "react-bootstrap/Pagination"

const computeTotalPage = (dataLength, pageLength) => {
    let totalPages = Math.floor(dataLength/pageLength)
    if (dataLength%pageLength > 0){
        totalPages+=1
    }
    return totalPages
  }

function LeaderBoard({ data, playerName }) {
  const itemPerpage = 5
  const [boardData, setBoardData] = useState(data)
  const [totalPages, setTotalPage] = useState(()=>computeTotalPage(data.length, itemPerpage))
  const [page, setPage] = useState(1)
  

  useEffect(()=>{
    // update total page
    setTotalPage(computeTotalPage(data.length, itemPerpage))
  },[data])

  // Calculale Page Navigator
  const pagiItems = ()=>{
    // Don't show the page navigator if there is only 1 page
    if (totalPages < 2){
        return []
    }
    // setTotalPage(totalPages)
    const items = [<Pagination.Prev onClick={prevPage} />]
    for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item key={number} active={number === page} onClick={(e)=>setPage(parseInt(e.target.innerText))}>
            {number}
          </Pagination.Item>,
        );
    }
    items.push(<Pagination.Next onClick={nextPage} />)
    return items
  }

  const nextPage = () =>{
    if(page < totalPages){
        setPage(page+1)
    }
  }

  const prevPage = () =>{
    if(page > 1){
        setPage(page-1)
    }
  }

  return (
        <div style={{textAlign: "center"}}>
            <h3>Leaderboard</h3>
            <ListGroup variant="flush">
                { boardData.slice((page-1)*itemPerpage, (page)*itemPerpage).map((item, index)=>
                    <ListGroup.Item key={item.key} active={localStorage.getItem("playerKey") === item.key}>
                        <div>
                            <div className="row" style={{padding: "0 20%"}}>
                                <div className="col ms-2 ms-auto">
                                    {item.name}
                                </div>
                                <div className="col ms-2">
                                    {item.score}
                                </div>
                            </div>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
            <Pagination>
                {pagiItems()}
            </Pagination>
        </div>
    )
}

export default LeaderBoard