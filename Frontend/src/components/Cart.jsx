import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSnackbar } from '../context/SnackbarContext';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Grid,
    Paper,
    Divider,
    Alert,
    Snackbar,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Switch,
    FormGroup
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingCartIcon,
    ArrowBack as ArrowBackIcon,
    Repeat as RepeatIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '4px',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    padding: '12px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: 'none',
    },
}));

export default function Cart() {
    const { items, removeFromCart, updateQuantity, getCartTotal, clearCart, setSubscriptionDetails } = useCart();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isSubscription, setIsSubscription] = useState(false);
    const [subscriptionDuration, setSubscriptionDuration] = useState('7days');

    // Function to calculate next delivery date
    const calculateNextDeliveryDate = (duration) => {
        const nextDate = new Date();
        if (duration === '7days') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (duration === '1month') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }
        return nextDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleQuantityChange = (medicineId , newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(medicineId);
            showSnackbar({
                message: 'Item removed from cart',
                severity: 'info'
            });
        } else {
            updateQuantity(medicineId, newQuantity);
        }
    };

    const handleRemoveItem = (medicineId) => {
        removeFromCart(medicineId);
        showSnackbar({
            message: 'Item removed from cart',
            severity: 'success'
        });
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleClearCart = () => {
        clearCart();
        showSnackbar({
            message: 'Cart cleared successfully',
            severity: 'success'
        });
    };

    const handleBack = () => {
        navigate('/medicines');
    };

    const handleSubscriptionToggle = (event) => {
        setIsSubscription(event.target.checked);
        if (!event.target.checked) {
            setSubscriptionDetails(null);
        } else {
            setSubscriptionDetails({
                isSubscription: true,
                duration: subscriptionDuration,
                frequency: subscriptionDuration === '7days' ? 'weekly' : 'monthly'
            });
        }
    };

    const handleDurationChange = (event) => {
        const duration = event.target.value;
        setSubscriptionDuration(duration);
        if (isSubscription) {
            setSubscriptionDetails({
                isSubscription: true,
                duration: duration,
                frequency: duration === '7days' ? 'weekly' : 'monthly'
            });
        }
    };

    if (items.length === 0) {
        return (
            <Box sx={{ backgroundColor: '#fafbfc', minHeight: '90vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                        <Typography variant="h4" component="h1" sx={{ mb: 2, color: '#666' }}>
                            Your Cart is Empty
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Looks like you haven't added any medicines to your cart yet.
                        </Typography>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={handleBack}
                            startIcon={<ArrowBackIcon />}
                        >
                            Continue Shopping
                        </StyledButton>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #d1fae5 100%)',
            minHeight: '90vh',
            py: 3,
            borderRadius : '12px',
        }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                            onClick={handleBack}
                            sx={{ 
                                mr: 2,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 4px rgba(16,185,129,0.07)',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 6px rgba(59,130,246,0.12)',
                                }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" component="h1" sx={{
                            fontSize: {
                                xs : '1.4rem',
                                sm : '2rem',
                                md : '2.5rem',
                                lg : '3rem',
                                xl : '3.5rem',
                            },
                            fontWeight: 900,
                            color: '#0f172a',
                            lineHeight: 1,
                            letterSpacing: '-0.025em',
                        }}>
                            Shopping Cart ({items.length} items)
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{ textTransform: 'none', borderColor: '#e11d48', color: '#e11d48', '&:hover': { borderColor: '#be123c', background: '#fef2f2', color: '#be123c' } }}
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {/* Cart Items */}
                    <Grid item xs={12} md={8}>
                        {items.map((item) => (
                            <StyledCard key={item.medicine._id} sx={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e0e7ef' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={3}>
                                            <CardMedia
                                                component="img"
                                                image={item.medicine.imageUrl}
                                                alt={item.medicine.name}
                                                sx={{
                                                    height: 120,
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    background: '#f8fafc',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                                                {item.medicine.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
                                                {item.medicine.description}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2563eb' }}>
                                                ₹{item.price}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <QuantityButton
                                                        onClick={() => handleQuantityChange(item.medicine._id, item.quantity - 1)}
                                                        size="small"
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </QuantityButton>
                                                    <Typography variant="body1" sx={{ minWidth: '30px', textAlign: 'center', color: '#0f172a' }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <QuantityButton
                                                        onClick={() => handleQuantityChange(item.medicine._id, item.quantity + 1)}
                                                        size="small"
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </QuantityButton>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                    Total: ₹{item.price * item.quantity}
                                                </Typography>
                                                <IconButton
                                                    sx={{ color: '#e11d48', '&:hover': { color: '#be123c', background: '#fef2f2' } }}
                                                    onClick={() => handleRemoveItem(item.medicine._id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </StyledCard>
                        ))}
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e0e7ef', boxShadow: '0 4px 20px rgba(16,185,129,0.07)' }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, color: '#0f172a' }}>
                                Order Summary
                            </Typography>
                            
                            {/* Subscription Section */}
                            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <RepeatIcon sx={{ mr: 1, color: '#2563eb' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                            Subscribe & Save
                                        </Typography>
                                    </Box>
                                    <Switch
                                        checked={isSubscription}
                                        onChange={handleSubscriptionToggle}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#2563eb',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#2563eb',
                                            },
                                        }}
                                    />
                                </Box>
                                
                                {isSubscription && (
                                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ mb: 1, color: '#64748b', fontWeight: 500 }}>
                                            Choose Subscription Duration:
                                        </Typography>
                                        <RadioGroup
                                            value={subscriptionDuration}
                                            onChange={handleDurationChange}
                                        >
                                            <FormControlLabel
                                                value="7days"
                                                control={<Radio sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                            7 Days Subscription
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            Weekly deliveries
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <FormControlLabel
                                                value="1month"
                                                control={<Radio sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                            1 Month Subscription
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            Monthly deliveries
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </RadioGroup>
                                        
                                        {/* Next Delivery Date Display */}
                                        <Box sx={{ 
                                            mt: 2, 
                                            p: 2, 
                                            backgroundColor: '#eff6ff', 
                                            borderRadius: '6px', 
                                            border: '1px solid #dbeafe' 
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af', mb: 0.5 }}>
                                                📅 Next Delivery Date:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                {calculateNextDeliveryDate(subscriptionDuration)}
                                            </Typography>
                                        </Box>
                                    </FormControl>
                                )}
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1" sx={{ color: '#334155' }}>Subtotal:</Typography>
                                    <Typography variant="body1" sx={{ color: '#334155' }}>₹{getCartTotal()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1" sx={{ color: '#334155' }}>Shipping:</Typography>
                                    <Typography variant="body1" sx={{ color: '#059669' }}>Free</Typography>
                                </Box>
                                {isSubscription && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1" sx={{ color: '#334155' }}>Subscription:</Typography>
                                        <Typography variant="body1" sx={{ color: '#059669', fontWeight: 500 }}>
                                            {subscriptionDuration === '7days' ? '7 Days' : '1 Month'}
                                        </Typography>
                                    </Box>
                                )}
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>Total:</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2563eb' }}>
                                        ₹{getCartTotal()}
                                    </Typography>
                                </Box>
                            </Box>

                            <StyledButton
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    letterSpacing: '0.01em',
                                    boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)',
                                        color: 'white',
                                    },
                                    mb: 2,
                                }}
                                fullWidth
                                size="large"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </StyledButton>

                            <StyledButton
                                variant="outlined"
                                sx={{
                                    borderColor: '#2563eb',
                                    color: '#2563eb',
                                    fontWeight: 700,
                                    letterSpacing: '0.01em',
                                    '&:hover': {
                                        borderColor: '#1d4ed8',
                                        background: '#eff6ff',
                                        color: '#1d4ed8',
                                    },
                                }}
                                fullWidth
                                onClick={handleBack}
                            >
                                Continue Shopping
                            </StyledButton>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 