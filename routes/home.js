const json = require('json');
module.exports = (home,express)=>{
  home.use(express.json());
  home.get('/',(req,res,next)=>{

    return res.render('home',{p:[{name:"pavan"},{email:"pvn@gamil.com"}]});

  });



};
