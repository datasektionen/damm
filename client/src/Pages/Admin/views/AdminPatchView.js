import React from 'react'
import TagClickable from '../../../components/TagClickable'
import { PRICE_TYPES } from '../../../config/constants'
import FileUploader from '../../../components/FileUploader'

const AdminPatchView = ({
        header = "Header",
        success = "",
        error = "",
        onSubmit,
        onReset,
        name,
        description,
        date,
        price = {type: "", value: ""},
        tags = [],
        handleChange,
        handleRadioChange,
        selectedTags,
        submitting,
        toggleTag,
        setImageCallback,
        setFileCallback,
        inStock = false,
        handleCheckbox,
        comment,
        ...rest
    }) => {

    const radioValues = Object.values(PRICE_TYPES)

    return (
        <div className="Admin">
            <div className="Header">
                <h2>{header}</h2>
            </div>
            <div className="Form">
                <form onSubmit={onSubmit}>
                    {rest.children}
                    <h3 id="obligatorisk">Bild på märket</h3>
                    <h4>Ta en så bra bild av märket som möjligt.</h4>
                    <FileUploader setFileCallback={setImageCallback}/>
                    <h3 id="obligatorisk">Namn</h3>
                    <input id="name" name="name" type="text" autoComplete="off" placeholder="Namn" value={name} onChange={handleChange} />
                    <h3>Beskrivning</h3>
                    <textarea id="description" name="description" placeholder="Beskrivning" value={description} onChange={handleChange} />
                    <div className="date">
                        <h3>Datum</h3>
                        <h4>Lämna tomt om okänt</h4>
                        <input name="date" type="date" value={date} onChange={handleChange}/>
                    </div>
                    <div className="priceandstock">
                        <div className="price">
                            <h3 id="obligatorisk">Pris</h3>
                            <h4>Ange pris för märket</h4>
                            <div>
                                {radioValues.map((x,i) =>
                                    <div key={"radioprice-"+i} className="radio">
                                        <input id={x} type="radio" checked={price.type === x} onChange={handleRadioChange}/>
                                        <label htmlFor={x}>{x}</label>
                                    </div>    
                                )}
                            </div>
                            {price.type === PRICE_TYPES.SET_PRICE && <input name="price" type="text" placeholder="Pris" value={price.value} onChange={handleChange}/>}
                        </div>
                        <div className="stock">
                            <h3>Finns i lager</h3>
                            <h4>Huruvida märket finns i lager, med andra ord om märket är till salu</h4>
                            <div className="chkboxprnt">
                                <div className="checkbox">
                                    <input type="checkbox" name="inStock" id="inStock" checked={inStock} onChange={handleCheckbox} />
                                    <label htmlFor="inStock">I lager</label>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="tagsection">
                        <h3>Taggar</h3>
                        <h4>Lägg till passande taggar till märket. Underlättar sökning.</h4>
                        {tags.length === 0 ?
                            <div className="tags">
                                <span className="notags">Inga taggar finns</span>
                            </div>
                        :
                        <div className="tags">
                            {tags.map((tag,i) => 
                                <TagClickable
                                    key={"tag-"+i}
                                    onClick={_ => toggleTag(tag)}
                                    {...tag}
                                    selectedTags={selectedTags}
                                />
                            )}
                        </div>}
                    </div>
                    <FileUploader
                        text="Ladda upp tillhörande filer till märket"
                        setFileCallback={setFileCallback}
                        imageOnly={false}
                    />
                    
                    {/* <div className="orders">
                        <h3>Ordrar</h3>
                        <h4>Ordernummer eller referensnummer från tidigare beställningar. För att underlätta framtida beställningar</h4>
                        <div className="input">
                            <input name="company" type="text" placeholder="Företag" value={this.state.company} onChange={(e) => handleChange(e)} />
                            <input name="order" type="text" placeholder="Referens" value={this.state.order} onChange={(e) => handleChange(e)} />
                            <input name="orderdate" type="date" value={this.state.orderdate} onChange={(e) => handleChange(e)} />
                            <button onClick={e => addOrder(e)} disabled={this.state.company === "" || this.state.order === ""}>Lägg till</button>
                        </div>
                        {this.state.orders.map((x,i) => <div className="order" key={i}>{x.company} {x.order}<i class="fa fa-times" onClick={(e) => removeOrder(e, i)}></i></div>)}
                    </div> */}
                    <h3>Prylisinformation</h3>
                    <h4>Information som bara prylis kan läsa, kan information om märket som känns viktigt att förmedla, exempelvis "öppna inte fil x i Adobe Illustrator"...</h4>
                    <textarea id="comment" name="comment" placeholder="Information" value={comment} onChange={handleChange} />
                    <div className="BottomButtons">
                        <button disabled={submitting} formAction="submit">{submitting ? "Sparar märke..." : "Spara märke"}</button>
                        <button className="rensa" onClick={(e) => {
                            e.preventDefault();
                            onReset()
                        }}>Rensa</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminPatchView