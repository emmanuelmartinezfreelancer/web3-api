import { useEffect, useState } from "react";
import { AiFillApi } from "react-icons/ai";
import { GrUserAdmin } from "react-icons/gr";
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";


export default function Sidebar({ authorized, activeview, setActiveView }) {

  const [activeMenu, setActiveMenu] = useState("");
  const [activeMainMenu, setActiveMainMenu] = useState("");

  useEffect(() => {
    console.log(authorized);
  }, [authorized, activeview, activeMenu]);

  return (
    <aside className="w-[370px] bg-white h-screen p-8 border-r-2 border-gray-600">
      <div className="flex flex-col w-full gap-3">
        <img onClick={()=>{  setActiveView("dashboard") }} src="/id3logo.svg" className="w-5/12 cursor-pointer" alt="logo" />
        <div className="flex flex-row gap-2 mt-2 pb-2 border-gray-200 border-b-2">
          <GrUserAdmin className="text-2xl my-auto" />
          <h1 className="text-lg text-left font-semibold">Key concepts</h1>
          { activeMainMenu === "keyconcepts" ?

            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMainMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMainMenu("keyconcepts");
            }}
            />
          

          }
        </div>

        { activeMainMenu === "keyconcepts" ?
          <ul className="flex flex-col w-full gap-2">

            <li
              onClick={(e) => {
                setActiveView("introduccion");
              }}
              className={`-mx-3 -my-1 ${activeview === "introduccion" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "introduccion" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Smart Contract
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("wallet");
              }}
              className={`-mx-3 -my-1 ${activeview === "wallet" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "wallet" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Wallet
              </p>
            </li>


            <li
              onClick={(e) => {
                setActiveView("gas");
              }}
              className={`-mx-3 -my-1 ${activeview === "gas" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "gas" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Gas
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("mint");
              }}
              className={`-mx-3 -my-1 ${activeview === "mint" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "mint" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Mint
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("storage");
              }}
              className={`-mx-3 -my-1 ${activeview === "storage" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "storage" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Almacenamiento distribuido
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("ipfs");
              }}
              className={`-mx-3 -my-1 ${activeview === "ipfs" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "ipfs" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                IPFS
              </p>
            </li>


            <li
              onClick={(e) => {
                setActiveView("about");
              }}
              className={`-mx-3 -my-1 ${activeview === "about" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "about" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Acerca de
              </p>
            </li>


          </ul>
          :
          null
          }

        { 
        authorized && (
          <>



          <div className="flex flex-row gap-2 mt-2 pb-2 border-gray-200 border-b-2">
             <AiFillApi className="text-2xl my-auto" />
             <h1 className="text-lg text-left font-semibold">API Endpoints</h1>
          </div>
          
          <div className="flex flex-row ">
          <p className={`cursor-pointer hover:text-gray-400 text-base`}>Getters</p>
          { activeMenu === "getters" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("getters");
            }}
            />
          }
          </div>
          {activeMenu === "getters" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Current Token ID
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                  GET
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Get Token price
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Is student?
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Get diploma
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Get beneficiary
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                  GET
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base">Setters</p>
          { activeMenu === "setters" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("setters");
            }}
            />
          }
          </div>

          {activeMenu === "setters" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Set student
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                  POST
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Set beneficiary wallet
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Set token price
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base">Mint</p>
          { activeMenu === "minters" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("minters");
            }}
            />
          }
          </div>

          {activeMenu === "minters" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Mint diploma
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                  POST
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Mint with price
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Mint free token
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base">Edits</p>
          { activeMenu === "edits" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("edits");
            }}
            />
          }
          </div>

          {activeMenu === "edits" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Edit token URI
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                  POST
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Edit diploma
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base">Utilities</p>
          { activeMenu === "utilities" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("utilities");
            }}
            />
          }
          </div>

          {activeMenu === "utilities" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Wallet online balance
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                  GET
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Wallet address
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Pull funds
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Validate token
                </p>
                <p className="text-green-700 text-base ml-auto mr-4 ">
                GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Validate token
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base">Delete</p>
          { activeMenu === "delete" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("delete");
            }}
            />
          }
          </div>

          {activeMenu === "delete" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Delete token
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Delete diploma
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Delete student
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>
              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base">Pause/Unpause</p>
          { activeMenu === "pauseunpause" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("pauseunpause");
            }}
            />
          }
          </div>

          {activeMenu === "pauseunpause" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Pause contract
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                }}
                className="">
                <div className="flex flex-row w-full">
                <p className="cursor-pointer hover:text-gray-400 text-base">
                Unpause contract
                </p>
                <p className="text-green-600 text-base ml-auto mr-4 ">
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

{/*           <ul>
            <li>
              <p className="cursor-pointer hover:text-gray-400 text-base">Getters</p>
            </li>

          </ul> */}

          </>
        )
        }


      </div>
    </aside>
  );
}
