import React,{Component} from 'react';

import './App.css';
import{
  Link, 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Prompt
  
  }from 'react-router-dom'


  const fakeApi={
    // 全部商品列表
    list:[{
      name:"荣耀MagicBook Pro 16.1英寸全面屏轻薄性能笔记本电脑（酷睿i5 8G 512G MX250 IPS FHD 指纹解锁）冰河银",
      price:"5499.00",
      img:"http://img12.360buyimg.com/n1/s450x450_jfs/t1/49259/35/4834/243670/5d280111E19cbe7cb/9c2d3dff5a821433.jpg",
      id:'1'
    }],
    // 购物车里的商品列表
    shoppingCar:[],
    // 获取全部商品
    getList:function(callback){
      callback(this.list)
    },
    // 获取某个商品详情
    getDetail:function(id,callback){
        callback(
          this.list.filter(e=>e.id===id)[0]
        )
    },
    // 将某个商品添加到购物车
    add:function(id,callback){
      this.shoppingCar.push(
        this.list.filter(e=>id===id)[0]
      )
      callback({code:200,msg:"添加购物车成功!"})
    },
    // 获取购物车全部商品
    getShoppingCar:function(callback){
      callback(
        this.shoppingCar
      )
    }
  }
  
// filter  符合的留下，不符合的扔掉



// 上面的导航条
class Nav extends Component{
  render(){
    return(
      <Route path="/"
      children={(routeProps)=>{
        var isRenderButton=routeProps.location.pathname==='/'?false:true
        var pathname=routeProps.location.pathname
        var pageName=""
        switch(pathname){
          case "/":
            pageName="首页"
            break
            
          case "/shopping_car":
              pageName="购物车"
              break
              case "/list":
                pageName="商品列表"
                break
          default:
              pageName="页面不存在"
              break
        }
        return(
          <div className="nav">
           {
             isRenderButton?(
               <button className="goback" onClick={routeProps.history.goBack}>{"<"}</button>
             ):""
           }
           <p className="page-title">{pageName}</p>
            </div>
        )
      }}
      >

      </Route>
    )
  }
}


class IndexView extends Component{
  render(){
    return(
      <ul>
        <li className="index-item">
          <Link to="/list" className="index-item-link">去到列表</Link> 
        </li>
      </ul>
    )
  }
}

// 下面的导航条
class BottomBar extends Component{
  render(){
    return(
      <div className="bottom-bar">
        <Link className="bottom-bar-button" to="/">首页</Link>
        <Link className="bottom-bar-button" to="/shopping_car">购物车</Link>
      </div>
    )
  }
}
class ListView extends Component{
  state={
    data:[]
  }
  componentWillMount(){
    fakeApi.getList((data)=>{
      this.setState({
        data:data
      })
    })
  }
  render(){
    const {data}=this.state
    return(
      <ul className="list">
        {
           data.map((v,k)=>(
             <li  key={v.id}>
               <Link to={`/detail/${v.id}`} className="item">
                 <img className="item-img" src={v.img} alt=""/>
                 <div className="item-wrap">
                 <p className="item-name">{v.name}</p>
                 <p className="item-price">{v.price}</p>
                 </div>
                
               </Link>
             </li>
           ))
        }
      </ul>
    )
  }
}


// 详情页
class DetailView extends Component{
  state={
    data:{}
  }
  componentWillMount(){
    console.log(this.props.match.params.id)
    var id=this.props.match.params.id
    fakeApi.getDetail(id,(data)=>{
      this.setState({
        data:data?data:{}
      })
    })

  }
  onAddToShoppingCar(id){
    fakeApi.add(id , ()=>{
      this.props.history.push('/shopping_car') //Link
    })
  }
  render(){
    const {data}=this.state
    return(
      <div className="detail-view">
        <img className="detail-img" src={data.img} alt=""/>
        <h4 className="detail-name">{data.name}</h4>
        <p className="detail-price">{data.price}</p>
        <div className="bottom-bar">
          <button className="buttom-button" onClick={()=>this.onAddToShoppingCar(data.id)}>加入购物车</button>
          <button className="buttom-button" id="buynow">立即购买</button>
        </div>
      </div>
    )
  }
}

class ShoppingCarView extends Component{
  state = {
    data : []
  }
  componentWillMount(){
    fakeApi.getShoppingCar((data)=>{
      this.setState({data : data})
    })
  }
  render(){
    const {data}  = this.state
    return(
      <ul className="shopping-view">
        {
          data.map((v,k)=>(
            <Link to={`/detail/${v.id}`} key={v.id + k}>
              <li className="shopping-item">
                <img className="item-img" src={v.img} alt=""/>
                <div className="item-wrap">
                  <p className="item-name">{v.name}</p>
                  <p className="item-price">{v.price}</p>
                </div>
              </li>
            </Link>
          ))
        }
      </ul>
    )
  }
}


class App extends Component{

  render(){
    return(
      <Router>
        <div>
<Nav></Nav>
<div className="App-main-view">
  <Route className="main-view" path="/" exact component={IndexView}></Route>
  <Route className="main-view" path="/list" exact component={ListView}></Route>
  <Route className="main-view" path="/detail/:id" exact component={DetailView}></Route>
  <Route className="main-view" path="/shopping_car" exact component={ShoppingCarView}></Route>
</div>
{/* <BottomBar></BottomBar> */}
<Route path="/" exact component={BottomBar}></Route>
        </div>
      </Router>
    )
  }
}
export default App;
