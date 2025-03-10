// "use client";
// import { useState } from "react";
// import AddCredit from "./AddCredit";
// import GenerateButton from "./GenerateButton";
// import { useCredit } from "@/hooks/credit";

// const Credits = () => {
//   const { credit } = useCredit();

//   const [creditAmout, setCreditAmount] = useState(0);
//   const [type, setType] = useState("");

//   return (
//     <div className="w-full p-6 bg-white rounded-lg shadow">
//       <div className="mb-2">
//         <h2 className="text-lg font-semibold">Credits</h2>
//         <p className="text-sm text-gray-500">
//           Your current credit balance and usage
//         </p>
//       </div>
//       {credit !== undefined && credit !== null ? (
//         <div className="relative">
//           <div className="text-2xl font-bold mb-2">
//             {credit}/{3000}
//           </div>
//           <div className="relative h-4 bg-gray-200 rounded-full">
//             <div
//               className="absolute left-0 top-0 h-full bg-black rounded-full transition-all duration-300"
//               style={{ width: `${(credit / 3000) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}

//       {/* <input
//         type="number"
//         placeholder="Enter credit amount"
//         value={creditAmout}
//         className="p-4 mt-4 w-full border border-gray-300 rounded-lg text-black font-semibold"
//         onChange={(e) => setCreditAmount(Number(e.target.value) || 0)}
//       />
//       <input
//         placeholder="Description"
//         value={type}
//         onChange={(e) => setType(e.target.value)}
//         className="p-4 mt-4 w-full border border-gray-300 rounded-lg text-black font-semibold"
//       ></input>

//       <GenerateButton amount={creditAmout} type={type} />
//       <AddCredit amount={creditAmout} type={type} /> */}
//     </div>
//   );
// };

// export default Credits;
