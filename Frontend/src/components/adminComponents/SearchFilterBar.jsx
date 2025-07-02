import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Paper,
  Typography,
  Chip,
  Fade,
  Grow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',


}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      border: '2px solid #667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
    fontWeight: 600,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      border: '2px solid #667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
    fontWeight: 600,
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(102, 126, 234, 0.1)',
  color: '#667eea',
  fontWeight: 600,
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
  },
}));

const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories = ['All'],
  searchPlaceholder = "Search..."
}) => {
  return (
    <Fade in={true} timeout={800}>
      <SearchContainer elevation={0}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: '2.25rem',/* text-4xl (base) */
              fontWeight: 900, /* font-black */
              color: '#0f172a', /* text-slate-900 */
              lineHeight: 1, /* leading-none */
              letterSpacing: '-0.025em', 

            }}
          >
          Find Your Medicine
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Search and filter through our comprehensive medicine catalog
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Grow in={true} timeout={1000}>
            <SearchTextField
              fullWidth
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: '#667eea',
                        fontSize: '1.5rem'
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grow>
        </Grid>
        <Grid item xs={12} md={4} sx={{ outline: 'none' }}>
          <Grow in={true} timeout={1200}>
            <StyledFormControl fullWidth>
              <InputLabel id="category-select-label">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneIcon sx={{ color: '#667eea', fontSize: '1.2rem' }} />
                  <Typography sx={{ fontWeight: 600 }}>
                    Category
                  </Typography>
                </Box>
              </InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TuneIcon sx={{ color: '#667eea', fontSize: '1.2rem' }} />
                    <Typography sx={{ fontWeight: 600 }}>
                      Category
                    </Typography>
                  </Box>
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }
                  }
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{
                      borderRadius: '8px',
                      margin: '2px 8px',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(102, 126, 234, 0.15)',
                        color: '#667eea',
                        fontWeight: 600,
                      }
                    }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grow>
        </Grid>
      </Grid>

      {(searchTerm || selectedCategory !== 'All') && (
        <Fade in={true} timeout={500}>
          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchTerm && (
              <FilterChip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                size="small"
              />
            )}
            {selectedCategory !== 'All' && (
              <FilterChip
                label={`Category: ${selectedCategory}`}
                onDelete={() => setSelectedCategory('All')}
                size="small"
              />
            )}
          </Box>
        </Fade>
      )}
    </SearchContainer>
    </Fade >
  );
};

export default SearchFilterBar;
