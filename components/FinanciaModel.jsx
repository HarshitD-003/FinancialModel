import React , {useState,useEffect,useCallback} from 'react';
import { Box,Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, TextField, Toolbar, Divider, Typography ,Grid , Tabs, Tab, Slider, Select, MenuItem} from '@mui/material';
import { Search, AccountCircle, Help, ExitToApp, Lock } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';

const drawerWidth = 240;

const FinancialModel = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [ovalue, setOValue] = React.useState(0);

  const [acquisitionPrice, setAcquisitionPrice] = useState(18000000);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(0);

  const [extraCharge, setextraCharge] = useState(150000);

  const [sellingPrice, setSellingPrice] = useState(29456783);
  const [sliderMin2, setSliderMin2] = useState(0);
  const [sliderMax2, setSliderMax2] = useState(0);

  const [Ltc, setLtc] = useState(90);
  const [sliderMin3, setSliderMin3] = useState(0);

  const [dropdownValue, setDropdownValue] = useState('yes');

  const [result, setResult] = useState(100);
  const [profit,setProfit] = useState(0);
  const [ROI,setROI] = useState(0);

  useEffect(() => {
    // Fetch the acquisition price from the backend and set it
    const fetchedPrice = 18000000; // Replace with your actual fetch call
    setAcquisitionPrice(fetchedPrice);

    // Calculate slider range based on fetched price
    const min = fetchedPrice - (fetchedPrice * 0.25);
    const max = fetchedPrice + (fetchedPrice * 0.25);
    setSliderMin(min);
    setSliderMax(max);
  }, []);

  useEffect(() => {
    // Fetch the acquisition price from the backend and set it
    const fetchedSPrice = 29456783; // Replace with your actual fetch call
    setSellingPrice(fetchedSPrice);

    // Calculate slider range based on fetched price
    const min = fetchedSPrice - (fetchedSPrice * 0.25);
    const max = fetchedSPrice + (fetchedSPrice * 0.25);
    setSliderMin2(min);
    setSliderMax2(max);
  }, []);

  useEffect(() => {
    // Fetch the acquisition price from the backend and set it
    const Ltcx = 90; // Replace with your actual fetch call
    setLtc(Ltcx);

    // Calculate slider range based on fetched price
    const min = Ltcx - (Ltcx * 0.25);
    setSliderMin3(min);
  }, []);

  const calculateAndFetch = useCallback(async () => {
    const time = parseInt(36);
    const startDate1= new Date();
    const startDate2= new Date(startDate1);
    const lastDate = new Date(startDate1);
    lastDate.setMonth(lastDate.getMonth() + 36);
    const extraDate = new Date(startDate1);
    extraDate.setMonth(extraDate.getMonth() + 35);
    startDate2.setDate(startDate2.getDate() + 30);
    const ebwTokenAmount = (100-parseInt(Ltc))*parseFloat(acquisitionPrice)/100;
    const  bookingAmount = (parseFloat(acquisitionPrice)>4500000)?(parseFloat(acquisitionPrice)*0.05):(parseFloat(acquisitionPrice)>2000000)?(parseFloat(acquisitionPrice)*0.03):(parseFloat(acquisitionPrice)*0.02)+(parseFloat(acquisitionPrice)*0.01);
    const totalAmount = parseFloat(acquisitionPrice);
    const intrestRate = parseFloat(8.5);
    const emi = parseFloat(acquisitionPrice)*parseFloat(intrestRate)*Math.pow((1+(parseFloat(intrestRate)/100)),parseFloat(time))/(100*Math.pow((1+(parseFloat(intrestRate)/100)),parseFloat(time)-1));
    const rent =0;
    const finalx = {date:new Date(lastDate),pay:parseFloat(sellingPrice)};
    const extraCharges = {date:new Date(extraDate),pay:parseFloat(extraCharge)+parseFloat(acquisitionPrice)*parseFloat(0.01)};
    const newEntries = [];
    const remainingAmount = parseFloat(acquisitionPrice)*(parseFloat(Ltc)/parseFloat(100));
    const quarter=parseFloat(time)/4;
    const equalQuarterlyPay = parseFloat(remainingAmount)*100/((parseFloat(quarter)-2)*parseFloat(acquisitionPrice));
    const currentDate = new Date();
    for(let i=0;i<quarter-2;i++){
      currentDate.setMonth(currentDate.getMonth() + 3);
      newEntries.push({date:new Date(currentDate),pay:parseFloat(equalQuarterlyPay)});
    }
    newEntries.push({date:new Date(currentDate),pay:parseInt(5)});

    const formData = {
      ebwTokenAmount,
      bookingAmount,
      startDate1,
      startDate2,
      totalAmount,
      intrestRate,
      emi,
      rent,
      newEntries,
      finalx,
      extraCharges,
    };

    try {
      console.log(formData);
      const response = await axios.post('https://fm-eight.vercel.app/api/uc_calculate_irr', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://fm-eight.vercel.app,,
        },
      });
      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.error || 'Failed to calculate XIRR');
      }
      const data = response.data;
      if (data.irr === null) {
        throw new Error("Incorrect Data Entered");
      }
      setResult(data.irr);
      const sum = data.cashflows_yearly.reduce((i, j) => i + j, 0);
      const pr = sum/(sum-data.cashflows_yearly[data.cashflows_yearly.length-1]);
      setProfit(sum);
      setROI(-pr*100);
    }
    catch (error) {
      console.error(error);
      setResult(error.message);
    }

  });

  useEffect(() => {
    calculateAndFetch();
  }, [acquisitionPrice, sellingPrice,Ltc,extraCharge]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handle0Change = (event, newValue) => {
    setOValue(newValue);
  };

  const handleSliderChange = (event, newValue) => {
    setAcquisitionPrice(newValue);
  };

  const handleSliderChange2 = (event, newValue) => {
    setSellingPrice(newValue);
  };

  const handleextraChargeChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setextraCharge(Number(value));
  };

  const handleLtcChange = (event) => {
    setLtc(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  }

  const items = [
    { text: 'Search', icon: <Search /> },
    { text: 'Vault', icon: <Lock /> },
    { text: 'My Profile', icon: <AccountCircle /> },
    { text: 'Help', icon: <Help /> },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            boxSizing: 'border-box',
            backgroundColor: 'white',
            color: 'rgb(21, 62, 59)',
            overflowX: 'hidden',
            transition: 'width 0.3s',
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: open ? 'left' : 'center', alignItems: 'center' }}>
          <IconButton onClick={handleDrawerToggle} style={{ color: 'rgb(21, 62, 59)', padding: 0 }}>
            <MenuIcon />
          </IconButton>
          {open && (
            <Typography variant="h4" noWrap component="div">
              Truestate
            </Typography>
          )}
        </Toolbar>
        <Divider />
        <List>
          {items.map((item, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleListItemClick(index)}
              selected={selectedIndex === index}
              sx={{
                padding: '10px 20px',
                color: 'rgb(21, 62, 59)',
                backgroundColor: selectedIndex === index ? 'rgb(21, 62, 59)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon style={{ color: 'rgb(21, 62, 59)', minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={<Typography variant="body1">{item.text}</Typography>} />}
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List style={{ marginTop: 'auto' }}>
          <ListItemButton
            onClick={() => handleListItemClick(items.length)}
            selected={selectedIndex === items.length}
            sx={{
              padding: '10px 20px',
              color: 'rgb(21, 62, 59)',
              backgroundColor: selectedIndex === items.length ? 'rgb(21, 62, 59)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon style={{ color: 'rgb(21, 62, 59)', minWidth: '40px' }}>
              <ExitToApp style={{ fontSize: 30 }} />
            </ListItemIcon>
            {open && <ListItemText primary={<Typography variant="body1">Log Out</Typography>} />}
          </ListItemButton>
        </List>
      </Drawer>
      <Grid container>
      <Grid item xs={12}>
        {/* Common information section */}
        <div style={{ height: '20vh', padding:'1%',borderBottom:"1px solid black"  }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Typography variant="h4" style={{ display: 'inline' }}>Abhee Celestial City</Typography>
          <Typography variant="h6" style={{ display: 'inline',marginLeft:'0.25rem',color:"rgb(21, 62, 59)",fontWeight:"800" }}> | {result}% IRR(Levered) | Strategy:Build to Sell</Typography>
        </div>
          <Typography variant="h6">393, First Floor, 15th Cross, 5th Main, Sector 6, HSR Layout, Bangalore</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        {/* Content for the first half of the remaining area */}
        <div style={{ height: '80vh', padding:'1%' }}>
          <Typography variant='body1' style={{color: 'navy'}}>Configure Project Inputs:</Typography>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Tabs value={value} onChange={handleChange} aria-label="tabs" sx={{ minHeight: 'auto', '& .MuiTab-root': { minHeight: 'auto', padding: '6px 16px' ,color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-selected': {
                      color: 'rgb(21, 62, 59)',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'rgb(21, 62, 59)',
                  } }}>
              <Tab label="Expenses and Income" />
              <Tab label="Financing" />
            </Tabs>
          </div>
          {value === 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            {/* Content for tab 1 */}
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '30%'}}>Acquisition Price:</Typography>
              <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '45%'}}
                sx={{
                      '& .MuiSlider-thumb': {
                        color: 'rgb(21, 62, 59)',
                      },
                      '& .MuiSlider-track': {
                        color: 'rgb(21, 62, 59)',
                      },
                      '& .MuiSlider-rail': {
                        color: 'rgb(21, 62, 59)',
                      },
                    }}
              />
              <TextField
                variant="outlined"
                disabled
                value={`₹${acquisitionPrice.toLocaleString()}`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
          </div>
          
            <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '30%'}}>Stamp Duty:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '45%',visibility:'hidden'}}
              />
              <TextField
                variant="outlined"
                disabled
                value={`₹${(acquisitionPrice>4500000)?(acquisitionPrice*0.05).toLocaleString():acquisitionPrice>2000000?(acquisitionPrice*0.03).toLocaleString():(acquisitionPrice*0.02).toLocaleString()}`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>Registration Charges:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <TextField
                variant="outlined"
                disabled
                value={`₹${(acquisitionPrice*0.01).toLocaleString()}`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
            </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '30%'}}>Extra Charges:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '45%',visibility:'hidden'}}
              />
              <TextField
                variant="outlined"
                value={`₹${extraCharge.toLocaleString()}`}
                onChange={handleextraChargeChange}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '30%'}}>Sale Proceeds:</Typography>
              <Slider
                value={sellingPrice}
                onChange={handleSliderChange2}
                min={sliderMin2}
                max={sliderMax2}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '45%'}}
                sx={{
                      '& .MuiSlider-thumb': {
                        color: 'rgb(21, 62, 59)',
                      },
                      '& .MuiSlider-track': {
                        color: 'rgb(21, 62, 59)',
                      },
                      '& .MuiSlider-rail': {
                        color: 'rgb(21, 62, 59)',
                      },
                    }}
              />
              <TextField
                variant="outlined"
                disabled
                value={`₹${sellingPrice.toLocaleString()}`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem',
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '30%'}}>Broker Charges:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '45%',visibility:'hidden'}}
              />
              <TextField
                variant="outlined"
                disabled
                value={`₹${sellingPrice*0.01.toLocaleString()}`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
            </div>
        </div>
        )}
        {value === 1 && (
          <div>
            {/* Content for tab 2 */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem' }}>
            <Typography variant="body1" style={{marginLeft:"1rem",width:"25%",marginTop:"0.75rem"}}>Debt Financing:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '50%',visibility:'hidden'}}
              />
        <Select
          value={dropdownValue}
          onChange={handleDropdownChange}
          variant="outlined"
          style={{ width: '8.75rem', marginTop: '1rem',height: '2rem'}}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
        </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop:'2rem',visibility:dropdownValue==="yes"?"visible":"hidden" }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '30%'}}>Loan To Cost:</Typography>
              <Slider
                value={Ltc}
                onChange={handleLtcChange}
                min={sliderMin3}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                style={{ width: '45%'}}
                sx={{
                      '& .MuiSlider-thumb': {
                        color: 'rgb(21, 62, 59)',
                      },
                      '& .MuiSlider-track': {
                        color: 'rgb(21, 62, 59)',
                      },
                      '& .MuiSlider-rail': {
                        color: 'rgb(21, 62, 59)',
                      },
                    }}
              />
              <TextField
                variant="outlined"
                disabled
                value={`${Ltc.toLocaleString()}%`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop:'1rem',visibility:dropdownValue==="yes"?"visible":"hidden" }}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>Implied Loan Amount:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <TextField
                variant="outlined"
                disabled
                value={`₹${(Ltc*acquisitionPrice/100).toLocaleString()}`}
                InputProps={{
                    style: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    height: '1.8rem',
                    borderRadius: '0rem', 
                    },
                }}
                sx={{ marginLeft: '2rem',
                width: '10rem',
                '& input': { textAlign: 'right' },}}
              />
            </div>
        </div>
        )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        {/* Content for the second half of the remaining area */}
        <div style={{ height: '80vh', padding:'1%',borderLeft:"1px solid black" }}>
            <Typography variant='body1' style={{color: 'navy'}}>Review Project Outputs:</Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
              <Tabs value={ovalue} onChange={handle0Change} aria-label="tabs" sx={{ minHeight: 'auto', '& .MuiTab-root': { minHeight: 'auto', padding: '6px 16px' ,color: 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-selected': {
                      color: 'rgb(21, 62, 59)',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'rgb(21, 62, 59)',
                  } }}>
                <Tab label="Levered Return Metrics" />
              </Tabs>
              </div>
              {ovalue === 0 && (
                <>
                  {/* <Typography variant="overline" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    Unlevered Return Metrics
                  </Typography>
          <div style={{ display: 'flex', alignItems: 'center', marginTop:'0.25rem'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>IRR(Unlevered):</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>{result}%</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>Profit(Unlevered):</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
            <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>77%</Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>ROI(Unlevered):</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>77%</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center',marginBottom:"2rem"}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>Equity Multiple(Unlevered):</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>1.77x</Typography>
            </div> */}
                  {/* <Typography variant="overline" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    Levered Return Metrics
                  </Typography> */}
                  <div style={{ display: 'flex', alignItems: 'center', marginTop:'0.25rem'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>IRR:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>{result}%</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>Profit:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
            <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>{profit.toFixed(2)}</Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>ROI:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>{ROI.toFixed(2)}%</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center'}}>
            <Typography variant="body1" style={{marginLeft: '1rem',marginRight: '1rem',width: '40%'}}>Equity Multiple:</Typography>
            <Slider
                value={acquisitionPrice}
                onChange={handleSliderChange}
                min={sliderMin}
                max={sliderMax}
                step={10000}
                valueLabelDisplay="auto"
                style={{ width: '35%',visibility:'hidden'}}
              />
              <Typography variant="body1" style={{marginLeft: '2rem',marginRight: '1rem',width: '10rem',textAlign: 'right'}}>{1+ROI.toFixed(0)/100}x</Typography>
            </div>
                </>
              )}
        </div>
      </Grid>
    </Grid>
    </div>
  );
};

export default FinancialModel;
