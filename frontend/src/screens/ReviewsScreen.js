import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const ReviewsScreen = ({ route, navigation }) => {
  const { station } = route.params;

  const reviews = [
    {
      id: 1,
      name: 'Shah Hussain',
      rating: 5,
      date: '2 days ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.',
      avatar: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=SH'
    },
    {
      id: 2,
      name: 'Shah Hussain',
      rating: 5,
      date: '2 days ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.',
      avatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=SH'
    },
    {
      id: 3,
      name: 'Shah Hussain',
      rating: 5,
      date: '2 days ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.',
      avatar: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=SH'
    },
    {
      id: 4,
      name: 'Shah Hussain',
      rating: 5,
      date: '2 days ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.',
      avatar: 'https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=SH'
    },
    {
      id: 5,
      name: 'Shah Hussain',
      rating: 5,
      date: '2 days ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.',
      avatar: 'https://via.placeholder.com/50x50/FFEAA7/FFFFFF?text=SH'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        size={16}
        color={index < rating ? theme.colors.warning : theme.colors.textSecondary}
      />
    ));
  };

  const renderReviewItem = (review) => (
    <View key={review.id} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.avatar }} style={styles.avatar} />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewerName}>{review.name}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(review.rating)}
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
      </View>

      {/* Station Info */}
      <View style={styles.stationInfo}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Gas+Station' }}
          style={styles.stationImage}
        />
        <View style={styles.stationLogo}>
          <View style={styles.logoContainer}>
            <Icon name="local-gas-station" size={24} color={theme.colors.textLight} />
            <Text style={styles.logoText}>ROYAL 400</Text>
            <Text style={styles.logoSubtext}>GASOLINE</Text>
          </View>
        </View>
        <Text style={styles.stationName}>Petro Tennessee</Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color={theme.colors.error} />
          <Text style={styles.locationText}>Abcd Canada</Text>
        </View>
      </View>

      {/* Reviews List */}
      <ScrollView style={styles.reviewsContainer}>
        {reviews.map(renderReviewItem)}
        
        {/* Read More Button */}
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  stationInfo: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  stationImage: {
    width: '100%',
    height: 200,
  },
  stationLogo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.textLight,
  },
  logoText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  logoSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  stationName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  locationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  reviewsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  reviewItem: {
    marginBottom: theme.spacing.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  reviewComment: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
  readMoreButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  readMoreText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textDecorationLine: 'underline',
  },
});

export default ReviewsScreen;
