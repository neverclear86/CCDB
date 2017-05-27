package net.neverclear.ccdb;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;

public class Test {
    public static void main(String[] args) {
        System.out.println("Connecting ... ");
        MongoClient client = null;
        try {
            client = new MongoClient("localhost", 27017);
            MongoDatabase db = client.getDatabase("mydb");

        } catch (Exception e) {
            System.out.println("Failed to connect to MongoDB");
        } finally {
            if (client != null) {
                client.close();
            }
        }

    }

}
