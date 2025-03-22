import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { icons } from "@/constants/icons";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start mt-5 justify-center">
    <Text className="text-light-200 text-sm font-normal">{label}</Text>
    <Text className="text-light-100 text-sm mt-2 font-bold">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
  } = useFetch(() => fetchMovieDetails(id as string));

  return (
    <View className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white text-2xl font-bold">{movie?.title}</Text>
          <View className="flex-row items-center mt-2 gap-x-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-lg">•</Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
            <Text className="text-light-200 text-lg">•</Text>
            <Text className="text-light-200 text-sm">{movie?.status}</Text>
          </View>

          <View className="flex-row items-center mt-2 gap-x-1 rounded-md bg-dark-100 px-3 py-2">
            <Image source={icons.star} className="w-5 h-5 mr-1" />
            <Text className="text-white text-sm font-bold">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Gwnres"
            value={movie?.genres.map((g) => g.name).join(" | ") || "N/A"}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${movie?.budget / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${movie?.revenue / 1_000_000}`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" | ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-10 right-0 left-0 mx-5 rounded-lg py-3.5 bg-accent items-center justify-center flex flex-row z-50"
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white text-base font-bold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({});
