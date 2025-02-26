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
const maxNumber = (req, res) => {

    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if(isNaN(num1) || isNaN(num2)) {
        return res.status(400).send({
            error : "Invalid Input"
        })
    }


    let maxNo = Math.max(num1, num2);
    return res.status(200).send({
        data : maxNo
    })

}
module.exports = {minNumber, maxNumber};