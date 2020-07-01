export const CREATE_PROPERTY = "CREATE_PROPERTY";
export const SET_PROPERTY = "SET_PROPERTY";
export const CREATE_PROPERTY_STADIUMS = "CREATE_PROPERTY_STADIUMS";
export const SET_STADIUM = "SET_STADIUM";
export const SET_PROPERTY_STADIUMS = "SET_PROPERTY_STADIUMS";
export const UPDATE_PROPERTY = "UPDATE_PROPERTY";

export const createProperty= (id,name,address,region,wilaya,balls,showers,bibs,rooms,roof,referee,owner_id) =>{
  
    return async dispatch =>{

        const propertyData={id,name,address,region,wilaya,balls,showers,bibs,rooms,roof,referee,owner_id};

        try{
            const response= await fetch('http://192.168.1.37:3000/property/addProperty',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(propertyData)
            });
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
           
            console.log('begin property action');
            dispatch({type:CREATE_PROPERTY,propertyData});
            console.log('begin property action');

        }catch(err){
            console.log(err);
        } 

    }
      

};

export const setProperties= ()=>{

    return async dispatch =>{

      try{
           const response= await fetch('http://192.168.1.37:3000/property');
           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }

           const resData= await response.json();
           
           dispatch({type:SET_PROPERTY,allProperties:resData});
           
      }catch(err){
          console.log(err);
      }

    };
}

export const createPropertyStadiums = (numStadium5x5,numStadium6x6,numStadium7x7,numStadium8x8,numStadium9x9,numStadium10x10,numStadium11x11,type5x5,type6x6,type7x7,type8x8,type9x9,type10x10,type11x11,property_id) =>{
  
    return async dispatch =>{

        const numStadium={numStadium5x5,numStadium6x6,numStadium7x7,numStadium8x8,
                          numStadium9x9,numStadium10x10,numStadium11x11};
        const numStadiumString=JSON.stringify(numStadium);                  
        const typeStadium={type5x5,type6x6,type7x7,type8x8,type9x9,type10x10,type11x11,property_id};                  

        try{
            const response= await fetch(`http://192.168.1.37:3000/property/addStadium/${numStadiumString}`,{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(typeStadium)
            });
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
            
            console.log('begin stadium action');
            dispatch({type:CREATE_PROPERTY_STADIUMS,typeStadium,numStadium});
            console.log('finish stadium action');

        }catch(err){
            console.log(err);
        } 

    }
}; 

export const setStadiums= ()=>{

    return async dispatch =>{

      try{
           const response= await fetch('http://192.168.1.37:3000/stadium');
           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }

           const resData= await response.json();
           
           dispatch({type:SET_STADIUM,allStadiums:resData});
           
      }catch(err){
          console.log(err);
      }

    };
}

export const setPropertyStadiums = ()=>{

    return async dispatch =>{

        try{
             const response= await fetch('http://192.168.1.6:3000/propertyStadiums');
             if(!response.ok){
              throw new Error('Oups! Une erreur est survenue.');
              }
  
             const resData= await response.json();
             
            // const allowners = resData.map(e=>{ return({propertyId :e.property_id , type : e.type})});
            //  console.log(allowners);
            let allOwners = [];
            let allInfos =[];
            let index ;
            resData.map(owner => {
                if(allOwners.indexOf(owner.property_id)===-1){
                    owner["allTypes"] = [];
                    allInfos.push(owner);
                    allOwners.push(owner.property_id);

                    ///////////
                     index  = allOwners.indexOf(owner.property_id);
                    allInfos[index].allTypes.push(owner.type);

                }
                else { 

                     index  = allOwners.indexOf(owner.property_id);
                    allInfos[index].allTypes.push(owner.type);
                   delete allInfos[index].type;
                    
                }

              
                  
              });

           dispatch({type:SET_PROPERTY_STADIUMS,allPropertyStadiums:allInfos});
             
        }catch(err){
            console.log(err);
        }
  
      };

};

export const updateProperty= (id,name,addressP,region,wilaya,ownerid) => {

    return async dispatch => {
  
         try{
           const response = await fetch(`http://192.168.1.37:3000/property/updateProperty/${ownerid}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({id,name,addressP,region,wilaya})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_PROPERTY,ownerid,propertyData:{id,name,addressP,region,wilaya}});
           
         }catch(err){
             console.log(err);
         }
    };
  
  };