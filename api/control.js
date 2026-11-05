export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('ContentType', 'aplication/json')

    if(req.method==='POST'){
        const {led} = req.body;
        return res.status(200).json({status: 'actualizado', led: led});
    }

    return res.status(200).json({
        led: 'LED_ON'
    });
}