
                {/*<TouchableOpacity>
                  <Card containerStyle={styles.acceptedCard}>
                    <View style={styles.cardHeader}>
                      <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                        <View style={{flex:.5}}>
                          <Text>Tickets#</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>AA000006</Text>
                        </View>
                      </View>
                      <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                        <View style={{flex:.5}}>
                          <Text>Service Name</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>Service Process Description Attribute</Text>
                        </View>
                      </View>
                      <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                        <View style={{flex:.5}}>
                          <Text>TAT (Date)</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>15/03/2018</Text>
                        </View>
                      </View>
                    </View>
                     <View style={{ flex: 1,flexDirection: "row", backgroundColor: "#ddd"}}>
                      <View style={{flex:.46,paddingVertical: 10,paddingHorizontal: 15}}>
                        <Text style={{ textAlign: "center" }}>
                          Alisha Bhatt
                        </Text>
                      </View>
                      <View style={{flex:.34,paddingVertical: 10,paddingHorizontal: 15}}>
                        <Text style={{ textAlign: "center" }}>
                          15/03/2018
                        </Text>
                      </View>
                      <View style={{flex:.23,paddingVertical: 10,paddingHorizontal: 15}}>
                        <Text style={{ textAlign: "center" }}>
                          4:20 AM
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity >
                  <Card containerStyle={styles.rejectedCard}>
                    <View style={styles.cardHeader}>
                      <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                        <View style={{flex:.5}}>
                          <Text>Tickets#</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>AA000006</Text>
                        </View>
                      </View>
                      <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                        <View style={{flex:.5}}>
                          <Text>Service Name</Text>
                        </View>
                        <View style={{ flex:.5}}>
                          <Text>Address Verification</Text>
                        </View>
                      </View>
                      <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                        <View style={{flex:.5}}>
                          <Text>TAT (Date)</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>15/03/2018</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ flex: 1,flexDirection: "row", backgroundColor: "#ddd"}}>
                      <View style={{flex:.46,paddingVertical: 10,paddingHorizontal: 15}}>
                        <Text style={{ textAlign: "center" }}>
                          Priyanka Kajulkar
                        </Text>
                      </View>
                      <View style={{flex:.34,paddingVertical: 10,paddingHorizontal: 15}}>
                        <Text style={{ textAlign: "center" }}>
                          15/03/2018
                        </Text>
                      </View>
                      <View style={{flex:.23,paddingVertical: 10,paddingHorizontal: 15}}>
                        <Text style={{ textAlign: "center" }}>
                          4:20 AM
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
*/}           {/*     <View style={{padding: 10,justifyContent:'center'}}>
                    <Table>
                      <Row data={tableHead} style={styles.head} textStyle={styles.headText}/>
                        {
                          tableData.map((data, i) => (
                            <TouchableOpacity key={i} onPress={()=>this.handleView(data[0], i)}>
                                  <Row data={data} style={[styles.row, i%2 && {backgroundColor: '#dbdbdb'}]}  textStyle={styles.text}/>
                            </TouchableOpacity>
                          ))
                        }
                    </Table>
                </View>*/}




                {this.props.viewTicketData?
                      <View style= {{flex:.5,marginRight:15}}>
                        <View style= {{flex:1,flexDirection:'row'}}>
                          <Text style= {{}}>{viewTicketData.firstName} </Text>
                          /*<Text>{userViewTicketData.lastName}</Text>*/
                        </View>
                        <View style= {{flex:1,flexDirection:'row'}}>
                          <Text style= {{flex:.5,flexDirection:'row'}}>{userViewTicketData.gender}</Text>
                          <Text style= {{flex:.5,flexDirection:'row'}}>21Years</Text>
                        </View>
                        <View style= {{flex:1,flexDirection:'row'}}>
                          <Text>{viewTicketData.verificationData.serviceName}</Text>
                        </View>
                      </View>
                    :<Loading />}




                    item.varificationDocument.map((imgData,i)=>
              <Image
                style={{ width: 50, height: 50, borderRadius: 15,}}
                resizeMode="stretch"
                source={require({imgData})}
              />
            )