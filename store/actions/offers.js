export const SET_OFFERS = "SET_OFFERS";


export const fetchOffers = (ownerId)=>{

return async dispatch =>{
    try {
    
    const arr = await fetch(`http://192.168.1.6:3000/owner/${ownerId}`);
    
    let offers2 = [];
        const resData = await arr.json ();
 
        let services = [];
        resData.map(
          item =>{ 
            if(services.indexOf(item.service_id) <0) 
            services.push(item.service_id)
          });
        
        
        services.forEach(service => {
   
          let newData = resData.filter(item => item.service_id === service);
         
          let offer  = { 
            id:service,
            horraires : [],
            stadiumsType : newData[0].type_match,
            matchTimeType :  newData[0].time_match,
            price :newData[0].tarif,
            ownerId : newData[0].owner_id,
            stadmiumNumber : newData[0].stadiumNum,
            offerDays : []
          }
       
          newData.map(item=>{
            
            const a = {
            day : item.date ,
            horraires : [  item.start.substring(0,5),item.end.substring(0,5) ] ,
            price : item.tarif,
            serviceId : service

            } 
            offer.offerDays.push(item.date);
            offer.horraires.push(a);

          })
      
          offers2.push(offer);
        });

        dispatch({type : SET_OFFERS , offers : offers2});
    } catch (error) {
      console.log("There is an Error");
      }
    
  

};

}