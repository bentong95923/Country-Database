import * as React from "react";

export default class FirstComponent extends React.Component<{}> {

        public render() {
                return (
                        <div className="centreText">
                                {/* React components must have a wrapper node/element */}
                                <div className="textareaFirst">
                                        Finding Country details: 
                                        <input type="text/plain" id="countryName" onKeyPress={this.handleOnChange} placeholder="Enter country name"
                                        />
                                </div>
                        </div>
                );
        }

        public handleOnChange = (event: any) => {
                if (event.key === 'Enter' && event.target.value.length > 2) {
                        this.searchCountry(event);
                }
        }

        public searchCountry = (event: any) => {
                alert('https://restcountries.eu/rest/v2/name/'+encodeURI(event.target.value));
                /* Calling api */
                /* https://restcountries.eu/rest/v2/name/ */
                
                fetch('https://restcountries.eu/rest/v2/name/'+encodeURI(event.target.value)+"?fullText=true", {
                        method: 'GET'
                })
                .then((response : any) => { // => is short hand for function declaration
                        if (!response.ok) {
                          this.setState({results: response.statusText})
                          alert(response);
                        }
                        else {
                                // response[0] = response;
                                alert(JSON.stringify(response));
                                // alert(response[0].name);
                          // response.json().then((data:any) => this.setState({results: data[0].class}))
                        }
                        return response
                })

        }
        /*
        public upload(base64String: string) {
                fetch('https://danktrigger.azurewebsites.net/api/dank', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'text/plain',
                  },
                  body: JSON.stringify({
                    file: base64String,
                  })
                })
                .then((response : any) => { // => is short hand for function declaration
                  if (!response.ok) {
                    this.setState({results: response.statusText})
                  }
                  else {
                    response.json().then((data:any) => this.setState({results: data[0].class}))
                  }
                  return response
                })
              }
            }*/

}