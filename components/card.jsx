// import { useState } from 'react'
// function Card() {
//   const [count, setCount] = useState(0)
// const style = {
//     color: "cyan",
// }
//   return (
//     <>
//       <div style={style} className='h-32 rounded-xl shadow-md w-56 bg-slate-400 border border-dashed'>
//         fa
//       </div>

//     </>
//   )
// }

// export default Card
import React from 'react';
import { useState } from 'react';
// import { HiBolt } from 'react-icons/hi'; // Example icon

const Card = ({ title, value, unit, icon, progress }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg mt-20 p-6 h-40 w-72">
      <div className="flex items-center justify-between">
        <div className="text-gray-600 text-lg font-medium">{title}</div>
        <div className="text-blue-500 text-2xl">{icon}</div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">
          {value} <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* <div className="mt-2 text-xs text-gray-500">{progress}% Usage</div> */}
      </div>
    </div>
  );
};

export default Card;
