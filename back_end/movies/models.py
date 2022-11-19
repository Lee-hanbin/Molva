from django.db import models
from django.conf import settings

# Create your models here.

class Genre(models.Model):
    genre_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)

class Actor(models.Model):
    actor_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)

class Director(models.Model):
    director_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)


class Movie(models.Model):
    genres = models.ManyToManyField(Genre, related_name='movie_genre')
    actors = models.ManyToManyField(Actor, related_name='movie_actor')
    directors = models.ManyToManyField(Director, related_name='movie_director')
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="like_movies")
    

    movie_id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=100)
    overview = models.TextField()
    runtime = models.IntegerField()
    release_date = models.DateField()
    popularity = models.FloatField()
    vote_count = models.IntegerField()
    vote_average = models.FloatField()
    poster_path = models.CharField(max_length=200, default=None)
    backdrop_path = models.CharField(max_length=200, default=None)

    def __str__(self):
        return self.title


class Review(models.Model):
    content = models.CharField(max_length=500)
    vote = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.content