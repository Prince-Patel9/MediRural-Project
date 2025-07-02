import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useSnackbar } from '../context/SnackbarContext';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Container,
    CircularProgress,
    Chip,
    IconButton,
    Divider,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 1200,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '20px',
    backgroundColor: '#ffffff',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    width: '100%',
    height: 400,
    objectFit: 'cover',
    borderRadius: '20px',
    backgroundColor: '#f8f9fa',
    [theme.breakpoints.up('md')]: {
        width: '45%',
        height: '400px',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    padding: {
        xs: '8px 16px',
        md: '12px 24px',
    },
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: 'none',
    },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '0.875rem',
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    bottom: 32,
    right: 32,
    zIndex: 1000,
    background: 'linear-gradient(90deg, #7f5fff 0%, #5e60ce 100%)',
    color: '#fff',
    boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)',
    '&:hover': {
        background: 'linear-gradient(90deg, #5e60ce 0%, #7f5fff 100%)',
    },
}));

export default function SingleMedicine() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, items } = useCart();
    const [quantity, setQuantity] = useState(1);
    const addToCartRef = useRef(null);
    const { showSnackbar } = useSnackbar();
    const cartQuantity = items.find(i => i.medicine._id === medicine?._id)?.quantity || 0;

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const response = await axios.get(`https://medirural.onrender.com/api/medicines/${id}`);
                if (response.data.success) {
                    setMedicine(response.data.medicine);
                }
                setLoading(false);
            } catch (err) {
                setError('Error fetching medicine : ' + err.message);
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id]);

    const handleBack = () => {
        navigate('/medicines');
    };

    const handleAddToCart = () => {
        if (medicine) {
            addToCart(medicine, quantity);
            showSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
        }
    };

    const handleScrollToCart = () => {
        if (addToCartRef.current) {
            addToCartRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={40} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    if (!medicine) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography variant="h6">Medicine not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#fafbfc', minHeight: '90vh', py: { xs: 1, md: 3 } }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: { xs: 1, md: 2 }, display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                        onClick={handleBack}
                        sx={{ 
                            mr: 2,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '&:hover': {
                                backgroundColor: 'white',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>
                        Medicine Details
                    </Typography>
                </Box>

                <StyledCard>
                    <StyledCardMedia
                        component="img"
                        image={medicine.imageUrl}
                        alt={medicine.name}
                    />
                    <Box sx={{ flex: 1, p: { xs: 2, md:2 } }}>
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box>
                                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                                    {medicine.name}
                                </Typography>
                                <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                                    ₹{medicine.price}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                                    {medicine.description}
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <InfoChip 
                                        label={medicine.stock > 10 ? 'In Stock' : medicine.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                        color={medicine.stock > 10 ? 'success' : medicine.stock > 0 ? 'warning' : 'error'}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {medicine.stock} units available
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', flex: '1 1 100px' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Category
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {medicine.category}
                                        </Typography>
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', flex: '1 1 100px' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Manufacturer
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {medicine.manufacturer}
                                        </Typography>
                                    </Paper>
                                </Box>

                                {medicine.expiryDate && (
                                   <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', flex: '1 1 100px' }}>
                                   <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                       Expiry Date
                                   </Typography>
                                   <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                       {new Date(medicine.expiryDate).toLocaleDateString()}
                                   </Typography>
                               </Paper>
                                )}
                            </Box>

                            {/* Action Area: In Cart, Quantity Selector, Buttons */}
                            <Box sx={{ mt: 'auto', pt: 4 }} ref={addToCartRef}>
                                {/* In Cart Indicator */}
                                {cartQuantity > 0 && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            mb: 1,
                                            fontSize: '1rem',
                                            letterSpacing: 0.2,
                                        }}
                                    >
                                        In Cart: {cartQuantity}
                                    </Typography>
                                )}
                                {/* Quantity Selector */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent : 'center',
                                        backgroundColor: 'rgba(66, 133, 244, 0.08)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(66, 133, 244, 0.2)',
                                        padding: '4px 8px',
                                        gap: 0.5,
                                        minWidth: 'fit-content',
                                        mb: 2
                                    }}
                                >
                                    <IconButton
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                        size="small"
                                        sx={{
                                            minWidth: 0,
                                            width: 28,
                                            height: 28,
                                            p: 0,
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(66, 133, 244, 0.12)',
                                            }
                                        }}
                                    >
                                        <RemoveIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            minWidth: 24,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                            color: 'primary.main',
                                            px: 0.5
                                        }}
                                    >
                                        {quantity}
                                    </Typography>
                                    <IconButton
                                        onClick={() => setQuantity(q => Math.min(medicine.stock, q + 1))}
                                        disabled={quantity >= medicine.stock}
                                        size="small"
                                        sx={{
                                            minWidth: 0,
                                            width: 28,
                                            height: 28,
                                            p: 0,
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(66, 133, 244, 0.12)',
                                            },
                                            '&:disabled': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                color: 'rgba(0, 0, 0, 0.26)',
                                            }
                                        }}
                                    >
                                        <AddIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                                {/* Action Buttons Row */}
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <StyledButton
                                        variant="contained"
                                        color="primary"
                                        disabled={medicine.stock === 0}
                                        onClick={handleAddToCart}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Add to Cart
                                    </StyledButton>
                                    <StyledButton
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleBack}
                                    >
                                        Back to Catalog
                                    </StyledButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Box>
                </StyledCard>
            </Container>
            <ScrollDownButton onClick={handleScrollToCart} aria-label="Scroll to Add to Cart">
                <KeyboardArrowDownIcon fontSize="large" />
            </ScrollDownButton>
        </Box>
    );
}