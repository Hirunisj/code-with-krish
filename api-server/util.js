function minNumber(req, res){
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if(isNaN(num1) || isNaN(num2)){
        return res.status(400).send({
            error : "Invalid Number"
        })
    }

    const minNum = Math.min(num1,num2) 
    return res.status(200).send({
        data : minNum
    })

}
function maxNumber (req, res) {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if(isNaN(num1) || isNaN(num2)) {
        return res.status(400).send({
            error : "Invalid Input"
        })
    }
    const maxNo = Math.max(num1, num2);
    return res.status(200).send({
        data : maxNo
    })

}

function avgValue(req, res) {
    const nums = req.query.num;
    const numArray = nums.split(',').map(num => parseFloat(num));
 
     if (numArray.some(num => isNaN(num))) {
          return res.status(400).send({
               error: "Invalid Input"
          });
     }
 
     const avg = numArray.reduce((sum, num) => sum + num, 0) / numArray.length;
     return res.status(200).send({
         data: avg
     });
 }

 function sortArray(req, res) {
    const nums = req.query.numbers;
    const order = req.query.order;

    if (!nums) {
        return res.status(400).send({
            error: "Invalid Input"
        });
    }

    const numArray = nums.split(',').map(num => parseFloat(num));

    if (numArray.some(num => isNaN(num))) {
        return res.status(400).send({
            error: "Invalid Input"
        });
    }

    if (order !== 'asc' && order !== 'desc') {
        return res.status(400).send({
            error: "Invalid Order"
        });
    }

    numArray.sort((a, b) => order === 'asc' ? a - b : b - a);

    return res.status(200).send({
        data: numArray
    });
}

// function searchNumber(req, res) {
//     const text = req.query.text;
//     const target = req.query.target;

//     if (!text || !target) {
//         return res.status(400).send({
//             error: "Text and target are required"
//         });
//     }
    
     
// }



module.exports = {minNumber, maxNumber, avgValue, sortArray, searchNumber};
