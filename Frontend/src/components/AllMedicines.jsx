import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import SearchFilterBar from './adminComponents/SearchFilterBar';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CardActions,
    Box,
    CircularProgress,
    Paper,
    Chip,
    Fade,
    Grow,
    Snackbar,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from '../context/SnackbarContext';
import { Add, Remove } from '@mui/icons-material';

// Styled components for enhanced UI
const StyledCard = styled(Card)(({ theme }) => ({
    height: '420px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#f8f9fa',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        height: '420px', // Fixed height on mobile
    },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: '200px', // Fixed height for consistent image display
    width: '100%',
    borderRadius: '12px',
    objectFit: 'cover',
    backgroundColor: '#f8f9fa',
    flexShrink: 0, // Prevent image from shrinking
    [theme.breakpoints.down('sm')]: {
        height: '180px', // Fixed height on mobile
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '6px',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    padding: '8px 12px',
    minHeight: '32px',
}));

const PriceChip = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.875rem',
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: '6px',
    height: '24px',
}));

const StockChip = styled(Chip)(({ theme }) => ({
    fontSize: '0.75rem',
    fontWeight: 500,
    borderRadius: '4px',
    height: '20px',
}));

export default function AllMedicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState(['All']);
    const navigate = useNavigate();
    const { addToCart, updateQuantity, removeFromCart, items } = useCart();
    const location = useLocation();
    const initialSearch = location.state?.search || '';
    const initialCategory = location.state?.category || 'All';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const { showSnackbar } = useSnackbar();

    const fetchMedicines = useCallback(async (search = '', category = 'All') => {
        try {
            if (search || category !== 'All') {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            const params = new URLSearchParams();
            if (search && search.trim()) {
                params.append('search', search.trim());
            }
            if (category && category !== 'All') {
                params.append('category', category);
            }

            const url = `https://medirural.onrender.com/api/medicines${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await axios.get(url);

            if (response.data.success) {
                const medicineData = response.data.medicines;
                setMedicines(medicineData);

                // Extract unique categories from all medicines (we'll need to fetch all for categories)
                if (search || category !== 'All') {
                    // If we're filtering, fetch all medicines to get categories
                    const allMedicinesResponse = await axios.get('https://medirural.onrender.com/api/medicines');
                    if (allMedicinesResponse.data.success) {
                        const uniqueCategories = ['All', ...new Set(allMedicinesResponse.data.medicines.map(med => med.category))];
                        setCategories(uniqueCategories);
                    }
                } else {
                    // If no filters, use current medicines for categories
                    const uniqueCategories = ['All', ...new Set(medicineData.map(med => med.category))];
                    setCategories(uniqueCategories);
                }
            } else {
                setError('Error fetching medicines: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            setError('Error fetching medicines: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedicines(initialSearch, initialCategory);
    }, [fetchMedicines, initialSearch, initialCategory]);

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);

        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for debounced search
        const timeout = setTimeout(() => {
            fetchMedicines(newSearchTerm, selectedCategory);
        }, 300); // 300ms delay

        setSearchTimeout(timeout);
    };

    const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
        fetchMedicines(searchTerm, newCategory);
    };

    const handleViewDetails = (id) => {
        navigate(`/medicine/${id}`);
    };

    const getCartQuantity = (medicineId) => {
        const item = items.find(i => i.medicine._id === medicineId);
        return item ? item.quantity : 0;
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

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

    return (
        <Box sx={{
            backgroundColor: '#fafbfc',
            minHeight: '100vh',
        }}>
            <Container maxWidth="xl" sx={{
                padding: {
                    xs: 0,
                    sm: 2
                }
            }}>


                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchChange}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={handleCategoryChange}
                    categories={categories}
                    searchPlaceholder="Search medicines by name, category, or manufacturer..."
                />

                <Grid container spacing={{ xs: 1, md: 3 }} sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    {searchLoading && (
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                                <CircularProgress size={30} thickness={3} />
                                <Typography variant="body2" sx={{ ml: 2 }}>Searching...</Typography>
                            </Box>
                        </Grid>
                    )}

                    {medicines.map((medicine, index) => {
                        const quantity = getCartQuantity(medicine._id);
                        return (
                            <Grid item key={medicine._id} xs={10} sm={6} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Grow in={true} timeout={300 + index * 50}>
                                    <StyledCard onClick={() => handleViewDetails(medicine._id)}>
                                        <StyledCardMedia
                                            component="img"
                                            image={medicine.imageUrl}
                                            alt={medicine.name}
                                        />
                                        <CardContent >
                                            <Box sx={{
                                                display: 'flex',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',

                                            }}>
                                                <Typography
                                                    variant="h6"
                                                    component="h2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        lineHeight: 1.1,
                                                        mr: { sm: 1 },
                                                        mb: { xs: 1, sm: 0 },
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}
                                                >
                                                    {medicine.name}
                                                </Typography>
                                                <PriceChip
                                                    label={`₹${medicine.price}`}
                                                />
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    height: '40px',

                                                }}
                                            >
                                                {medicine.description}
                                            </Typography>

                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,


                                            }}>
                                                <StockChip
                                                    size="small"
                                                    label={medicine.stock > 10 ? 'In Stock' : medicine.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                                    color={medicine.stock > 10 ? 'success' : medicine.stock > 0 ? 'warning' : 'error'}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {medicine.stock} left
                                                </Typography>
                                            </Box>
                                        </CardContent>

                                        <CardActions
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                gap: { xs: 1.5, sm: 0.5 },
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            {quantity === 0 ? (
                                                <StyledButton
                                                    variant="outlined"
                                                    color="primary"
                                                    fullWidth={{ xs: true, sm: false }}
                                                    
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        addToCart(medicine, 1);
                                                        showSnackbar({ message: 'Added to cart!', severity: 'success' });
                                                    }}
                                                >
                                                    Add to Cart
                                                </StyledButton>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        backgroundColor: 'rgba(66, 133, 244, 0.08)',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(66, 133, 244, 0.2)',
                                                        padding: '4px 8px',
                                                        gap: 0.5,
                                                        flex: { xs: 'none', sm: 1 },
                                                        minWidth: 'fit-content',
                                                        width: { xs: '100%', sm: 'auto' },
                                                        justifyContent: { xs: 'center', sm: 'flex-start' }
                                                    }}
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <StyledButton
                                                        variant="text"
                                                        color="primary"
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
                                                        onClick={() => {
                                                            if (quantity === 1) {
                                                                removeFromCart(medicine._id);
                                                                showSnackbar({ message: 'Removed from cart', severity: 'info' });
                                                            } else {
                                                                updateQuantity(medicine._id, quantity - 1);
                                                            }
                                                        }}
                                                    >
                                                        <Remove sx={{ fontSize: 16 }} />
                                                    </StyledButton>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            minWidth: 24,
                                                            textAlign: 'center',
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            color: 'primary.main',
                                                            px: 0.5
                                                        }}
                                                    >
                                                        {quantity}
                                                    </Typography>

                                                    <StyledButton
                                                        variant="text"
                                                        color="primary"
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
                                                        onClick={() => {
                                                            updateQuantity(medicine._id, quantity + 1);
                                                        }}
                                                        disabled={quantity >= medicine.stock}
                                                    >
                                                        <Add sx={{ fontSize: 16 }} />
                                                    </StyledButton>
                                                </Box>
                                            )}

                                            <StyledButton
                                                variant="contained"
                                                color="primary"
                                                fullWidth={{ xs: true, sm: false }}
                                                sx={{
                                                    flex: { xs: 'none', sm: 1 },
                                                    minWidth: { sm: 120 }
                                                }}
                                                onClick={() => handleViewDetails(medicine._id)}
                                            >
                                                View Details
                                            </StyledButton>
                                        </CardActions>
                                    </StyledCard>
                                </Grow>
                            </Grid>
                        )
                    })}
                    {medicines.length === 0 && !searchLoading && (
                        <Grid item xs={12}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                py={8}
                                textAlign="center"
                            >
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No medicines found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {searchTerm ? `No results for "${searchTerm}"` : 'Try adjusting your search or category filter'}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}   